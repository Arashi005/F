const Player = require('../database/models/Player');
const Moderator = require('../database/models/Moderator');
const Log = require('../database/models/Log');
const { isOwner } = require('../systems/permissionEngine');
const { computeStats } = require('../systems/levelEngine');

async function ownerOnly(ctx, fn) {
  if (!(await isOwner(ctx.sender))) return ctx.reply('⛔ Access denied. Owner only.');
  return fn();
}

module.exports = [
  {
    name: 'ownermenu',
    hidden: true,
    async execute(ctx) {
      return ownerOnly(ctx, () => ctx.reply(
`╭━━━〔 👑 OWNER MENU 〕━━━╮
Status: Owner

.addgold @user <amt>
.removegold @user <amt>
.setgold @user <amt>
.addxp @user <amt>
.setlevel @user <lvl>
.resetplayer @user
.modadd @user
.modremove @user
.maintenance on/off
.restart
.shutdown
╰━━━━━━━━━━━━━━━━━━━━━━━━━╯`));
    },
  },
  {
    name: 'addgold',
    hidden: true,
    async execute(ctx) {
      return ownerOnly(ctx, async () => {
        const target = ctx.mentionedJids?.[0];
        const amount = parseInt(ctx.args[ctx.args.length - 1], 10);
        if (!target || !amount) return ctx.reply('Usage: .addgold @user <amount>');
        await Player.updateOne({ jid: target }, { $inc: { gold: amount } });
        await Log.create({ actor: ctx.sender, target, command: 'addgold', result: 'success', meta: { amount } });
        return ctx.reply(`✅ Added ${amount} EG to player.`);
      });
    },
  },
  {
    name: 'removegold',
    hidden: true,
    async execute(ctx) {
      return ownerOnly(ctx, async () => {
        const target = ctx.mentionedJids?.[0];
        const amount = parseInt(ctx.args[ctx.args.length - 1], 10);
        if (!target || !amount) return ctx.reply('Usage: .removegold @user <amount>');
        const p = await Player.findOne({ jid: target });
        if (!p) return ctx.reply('❌ Not found.');
        p.gold = Math.max(0, p.gold - amount);
        await p.save();
        await Log.create({ actor: ctx.sender, target, command: 'removegold', result: 'success', meta: { amount } });
        return ctx.reply(`✅ Removed ${amount} EG.`);
      });
    },
  },
  {
    name: 'setgold',
    hidden: true,
    async execute(ctx) {
      return ownerOnly(ctx, async () => {
        const target = ctx.mentionedJids?.[0];
        const amount = parseInt(ctx.args[ctx.args.length - 1], 10);
        if (!target || isNaN(amount)) return ctx.reply('Usage: .setgold @user <amount>');
        await Player.updateOne({ jid: target }, { gold: Math.max(0, amount) });
        await Log.create({ actor: ctx.sender, target, command: 'setgold', result: 'success', meta: { amount } });
        return ctx.reply(`✅ Set gold to ${amount}.`);
      });
    },
  },
  {
    name: 'addxp',
    hidden: true,
    async execute(ctx) {
      return ownerOnly(ctx, async () => {
        const target = ctx.mentionedJids?.[0];
        const amount = parseInt(ctx.args[ctx.args.length - 1], 10);
        if (!target || !amount) return ctx.reply('Usage: .addxp @user <amount>');
        await Player.updateOne({ jid: target }, { $inc: { xp: amount } });
        return ctx.reply(`✅ Added ${amount} XP.`);
      });
    },
  },
  {
    name: 'setlevel',
    hidden: true,
    async execute(ctx) {
      return ownerOnly(ctx, async () => {
        const target = ctx.mentionedJids?.[0];
        const level = parseInt(ctx.args[ctx.args.length - 1], 10);
        if (!target || !level) return ctx.reply('Usage: .setlevel @user <level>');
        const p = await Player.findOne({ jid: target });
        if (!p) return ctx.reply('❌ Not found.');
        p.level = level;
        const s = computeStats(p.race, p.class, level);
        p.maxHp = s.hp; p.hp = s.hp;
        p.maxMp = s.mp; p.mp = s.mp;
        p.attack = s.attack; p.defense = s.defense;
        p.speed = s.speed; p.magic = s.magic;
        await p.save();
        return ctx.reply(`✅ Level set to ${level}.`);
      });
    },
  },
  {
    name: 'resetplayer',
    hidden: true,
    async execute(ctx) {
      return ownerOnly(ctx, async () => {
        const target = ctx.mentionedJids?.[0];
        if (!target) return ctx.reply('Usage: .resetplayer @user');
        await Player.deleteOne({ jid: target });
        await Log.create({ actor: ctx.sender, target, command: 'resetplayer', result: 'success' });
        return ctx.reply('✅ Player reset.');
      });
    },
  },
  {
    name: 'modadd',
    hidden: true,
    async execute(ctx) {
      return ownerOnly(ctx, async () => {
        const target = ctx.mentionedJids?.[0];
        if (!target) return ctx.reply('Usage: .modadd @user');
        await Moderator.updateOne(
          { jid: target },
          { $setOnInsert: { jid: target, addedBy: ctx.sender } },
          { upsert: true }
        );
        return ctx.reply('✅ Moderator added.');
      });
    },
  },
  {
    name: 'modremove',
    hidden: true,
    async execute(ctx) {
      return ownerOnly(ctx, async () => {
        const target = ctx.mentionedJids?.[0];
        if (!target) return ctx.reply('Usage: .modremove @user');
        await Moderator.deleteOne({ jid: target });
        return ctx.reply('✅ Moderator removed.');
      });
    },
  },
  {
    name: 'restart',
    hidden: true,
    async execute(ctx) {
      return ownerOnly(ctx, async () => {
        await ctx.reply('♻️ Restarting...');
        setTimeout(() => process.exit(0), 1000);
      });
    },
  },
  {
    name: 'shutdown',
    hidden: true,
    async execute(ctx) {
      return ownerOnly(ctx, async () => {
        await ctx.reply('🛑 Shutting down...');
        setTimeout(() => process.exit(0), 1000);
      });
    },
  },
];