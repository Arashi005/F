const mongoose = require('mongoose');

const moderatorSchema = new mongoose.Schema({
  jid: { type: String, required: true, unique: true, index: true },
  addedBy: String,
  addedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Moderator', moderatorSchema);