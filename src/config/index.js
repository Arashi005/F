require('dotenv').config();

module.exports = {
  mongodbUri: process.env.MONGODB_URI,
  ownerJid: (process.env.OWNER_JID || '').trim(),
  botNumber: (process.env.BOT_NUMBER || '').replace(/\D/g, ''),
  prefix: process.env.PREFIX || '.',
  sessionDir: process.env.SESSION_DIR || './auth_session',
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  currencyName: 'Elven Gold',
  currencySymbol: 'EG',
};