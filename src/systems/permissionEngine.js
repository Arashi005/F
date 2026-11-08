const config = require('../config');
const Moderator = require('../database/models/Moderator');

async function isOwner(jid) {
  return jid === config.ownerJid || jid.split('@')[0] === config.ownerJid.split('@')[0];
}

async function isModerator(jid) {
  if (await isOwner(jid)) return true;
  return !!(await Moderator.findOne({ jid }));
}

module.exports = { isOwner, isModerator };