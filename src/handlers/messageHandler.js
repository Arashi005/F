const config = require('../config');
const { handleCommand } = require('./commandHandler');
const Player = require('../database/models/Player');
const Group = require('../database/models/Group');
const logger = require('../utils/logger');

async function onMessage(sock, msg) {
  try {
    if (!msg.message) return;
    const from = msg.key.remoteJid;
    if (!from || from === 'status@broadcast') return;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      msg.message.imageMessage?.caption ||
      '';
    if (!text || !text.startsWith(config.prefix)) return;

    const sender = msg.key.participant || msg.key.remoteJid;
    const isGroup = from.endsWith('@g.us');

    // Per-group mode check
    if (isGroup) {
      let g = await Group.findOne({ jid: from });
      if (!g) g = await Group.create({ jid: from, name: '' });
      if (g.mode === 'private') {
        const { isModerator } = require('../systems/permissionEngine');
        if (!(await isModerator(sender))) {
          // Silently ignore non-mods in private-mode groups
          return;
        }
      }
    }

    const body = text.slice(config.prefix.length).trim();
    const parts = body.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Extract mentioned JIDs
    const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid || [];

    const ctx = {
      sock,
      msg,
      sender,
      from,
      isGroup,
      groupJid: isGroup ? from : null,
      pushName: msg.pushName,
      command,
      args,
      mentionedJids: mentioned,
      reply: (content) => sock.sendMessage(from, { text: content }, { quoted: msg }),
      dispatch: async (name) => handleCommand({ ...ctx, command: name, args: [] }),
    };

    await handleCommand(ctx);
  } catch (e) {
    logger.error({ err: e.message, stack: e.stack });
  }
}

module.exports = { onMessage };