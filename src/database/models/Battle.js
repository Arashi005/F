const mongoose = require('mongoose');

const battleSchema = new mongoose.Schema({
  playerJid: { type: String, required: true, index: true },
  monsterId: String,
  monsterName: String,
  monsterHp: Number,
  monsterMaxHp: Number,
  monsterAttack: Number,
  monsterDefense: Number,
  monsterSpeed: Number,
  turn: { type: Number, default: 1 },
  status: { type: String, enum: ['active', 'victory', 'defeat', 'escaped'], default: 'active' },
  log: [String],
  startedAt: { type: Date, default: Date.now },
});

battleSchema.index({ playerJid: 1, status: 1 });

module.exports = mongoose.model('Battle', battleSchema);