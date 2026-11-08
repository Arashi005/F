const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  jid: { type: String, required: true, unique: true, index: true },
  name: { type: String, default: '' },
  mode: { type: String, enum: ['public', 'private'], default: 'public' },
  settings: {
    antilink: { type: Boolean, default: false },
    antispam: { type: Boolean, default: false },
    antibadword: { type: Boolean, default: false },
    antitag: { type: Boolean, default: false },
    welcome: { type: Boolean, default: false },
    goodbye: { type: Boolean, default: false },
    autoreact: { type: Boolean, default: false },
  },
  warnings: [{
    jid: String,
    count: { type: Number, default: 0 },
    reasons: [String],
  }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Group', groupSchema);