const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const config = require('./config');
const logger = require('./utils/logger');
const { connectDatabase } = require('./database/connection');
const { onMessage } = require('./handlers/messageHandler');

let sock = null;
let reconnectAttempts = 0;

async function startBot() {
  await connectDatabase();

  const { state, saveCreds } = await useMultiFileAuthState(config.sessionDir);
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: !config.botNumber,
    auth: state,
    browser: ['Frieren RPG', 'Chrome', '1.0.0'],
  });

  // Pairing code
  if (config.botNumber && !sock.authState.creds.registered) {
    await new Promise(r => setTimeout(r, 3000));
    try {
      const code = await sock.requestPairingCode(config.botNumber);
      logger.info(`🔑 PAIRING CODE: ${code}`);
      logger.info('Enter this in WhatsApp → Linked Devices → Link with phone number');
    } catch (e) {
      logger.error('Pairing failed: ' + e.message);
    }
  }

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr && !config.botNumber) {
      require('qrcode-terminal').generate(qr, { small: true });
    }
    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = code !== DisconnectReason.loggedOut;
      logger.warn(`Connection closed (${code}). Reconnect: ${shouldReconnect}`);
      if (shouldReconnect && reconnectAttempts < 20) {
        reconnectAttempts++;
        setTimeout(startBot, Math.min(5000 * reconnectAttempts, 60000));
      } else {
        logger.error('Reconnection limit reached or logged out.');
        process.exit(1);
      }
    } else if (connection === 'open') {
      reconnectAttempts = 0;
      logger.info(`✅ Connected as ${sock.user?.id}`);
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const m of messages) {
      if (!m.key.fromMe) await onMessage(sock, m);
    }
  });
}

process.on('uncaughtException', (e) => logger.error('uncaught: ' + e.message));
process.on('unhandledRejection', (e) => logger.error('unhandled: ' + (e?.message || e)));
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, exiting');
  process.exit(0);
});

startBot().catch(e => {
  logger.error('Fatal startup error: ' + e.message);
  process.exit(1);
});