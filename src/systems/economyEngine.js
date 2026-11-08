const Player = require('../database/models/Player');
const Transaction = require('../database/models/Transaction');

async function transfer(sender, recipientJid, amount) {
  if (amount <= 0) return { error: 'Amount must be positive.' };
  if (sender.jid === recipientJid) return { error: 'Cannot transfer to yourself.' };

  const senderDoc = await Player.findOne({ jid: sender.jid });
  if (!senderDoc || senderDoc.gold < amount) return { error: 'Insufficient funds.' };

  const recipientDoc = await Player.findOne({ jid: recipientJid });
  if (!recipientDoc) return { error: 'Recipient not registered.' };

  // Atomic transfer
  const updated = await Player.findOneAndUpdate(
    { jid: sender.jid, gold: { $gte: amount } },
    { $inc: { gold: -amount } },
    { new: true }
  );
  if (!updated) return { error: 'Transfer failed.' };

  await Player.updateOne({ jid: recipientJid }, { $inc: { gold: amount } });

  await Transaction.create({
    from: sender.jid, to: recipientJid, amount,
    type: 'transfer', note: 'Player transfer',
  });

  return { success: true, newBalance: updated.gold };
}

async function logAdminGrant(actor, target, amount, note) {
  await Transaction.create({ from: actor, to: target, amount, type: 'admin', note });
}

module.exports = { transfer, logAdminGrant };