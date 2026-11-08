const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  actor: String,
  target: String,
  command: String,
  groupJid: String,
  result: String,
  meta: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now, index: true },
});

module.exports = mongoose.model('Log', logSchema);