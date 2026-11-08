const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  from: String,
  to: String,
  amount: Number,
  currency: { type: String, default: 'EG' },
  type: { type: String, enum: ['transfer', 'reward', 'admin', 'purchase', 'sale'], required: true },
  note: String,
  createdAt: { type: Date, default: Date.now, index: true },
});

module.exports = mongoose.model('Transaction', transactionSchema);