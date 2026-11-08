const Player = require('../database/models/Player');
const Transaction = require('../database/models/Transaction');
const { transfer } = require('../systems/economyEngine');
const { randomInt } = require('../utils/helpers');
const { setCooldown, getRemaining, formatCooldown } = require('../utils/cooldown');
const { formatNumber } = require('../utils/helpers');

module.exports = [
  {
    name: 'balance',
    async execute(ctx) {
      const p = await Player.findOne({ jid: ctx.sender });
      if (!p) return ctx.reply('❌ Not registered.');
      return ctx.reply(`🪙 Balance: ${formatNumber(p.gold)} EG`);
    },
  },
  {
    name: 'daily',
    async execute(ctx) {
      const p = await Player.findOne({ jid: ctx.sender });
      if (!p) return ctx.reply('❌ Not registered.');
      const cooldownKey = `daily:${ctx.sender}`;
      const left = getRemaining(cooldownKey);
      if (left > 0) return ctx.reply(`⏳ Come back in ${formatCooldown(left)}.`);
      const reward = randomInt(150, 400);
      p.gold += reward;
      p.lastDaily = new Date();
      await p.save();
      setCooldown(cooldownKey, 24 * 60 * 60 * 1000);
      return ctx.reply(`🪙 Daily reward: +${reward} EG!`);
    },
  },
  {
    name: 'work',
    async execute(ctx) {
      const p = await Player.findOne({ jid: ctx.sender });
      if (!p) return ctx.reply('❌ Not registered.');
      const key = `work:${ctx.sender}`;
      const left = getRemaining(key);
      if (left > 0) return ctx.reply(`⏳ You are tired. Rest ${formatCooldown(left)}.`);
      const reward = randomInt(50, 150);
      p.gold += reward;
      await p.save();
      setCooldown(key, 60 * 60 * 1000);
      return ctx.reply(`⚒️ You worked and earned ${reward} EG.`);
    },
  },
  {
    name: 'transfer',
    async execute(ctx) {
      const targetMention = ctx.mentionedJids?.[0];
      const amount = parseInt(ctx.args[ctx.args.length - 1], 10);
      if (!targetMention || !amount || amount <= 0) {
        return ctx.reply('Usage: .transfer @user <amount>');
      }
      const sender = await Player.findOne({ jid: ctx.sender });
      if (!sender) return ctx.reply('❌ Not registered.');
      const result = await transfer(sender, targetMention, amount);
      if (result.error) return ctx.reply(`❌ ${result.error}`);
      return ctx.reply(`✅ Sent ${formatNumber(amount)} EG. Balance: ${formatNumber(result.newBalance)}`);
    },
  },
  {
    name: 'transactions',
    async execute(ctx) {
      const txs = await Transaction.find({
        $or: [{ from: ctx.sender }, { to: ctx.sender }],
      }).sort({ createdAt: -1 }).limit(10);
      if (!txs.length) return ctx.reply('No transactions.');
      const lines = txs.map(t => {
        const dir = t.from === ctx.sender ? '➡️' : '⬅️';
        return `${dir} ${formatNumber(t.amount)} EG — ${t.type}`;
      }).join('\n');
      return ctx.reply(`📜 Last transactions:\n${lines}`);
    },
  },
];