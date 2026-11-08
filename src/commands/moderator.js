const Player = require('../database/models/Player');
const Moderator = require('../database/models/Moderator');
const Group = require('../database/models/Group');
const Log = require('../database/models/Log');
const { isModerator, isOwner } = require('../systems/permissionEngine');
const { formatNumber } = require('../utils/helpers');

module.exports = [
  {
    name: 'modmenu',
    hidden: true,
    async execute(ctx) {
      if (!(await isModerator(ctx.sender))) {
        return ctx.reply('⛔ Access denied. Moderator only.');
      }
      return ctx.reply(
`╭━━━〔 🛡️ MODERATOR MENU 〕━━━╮
Status: ${(await isOwner(ctx.sender)) ? 'Owner' : 'Moderator'}

.modlist — List moderators
.ban @user — Ban player
.unban @user — Unban player
.grouplist — List groups
.groupinfo <jid> — Group details
.broadcast <msg> — Send announcement
.botstats — Bot statistics
.mode private/public — Set group mode
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`);
    },
  },
  {
    name: 'modlist',
    hidden: true,
    async execute(ctx) {
      if (!(await isModerator(ctx.sender))) return ctx.reply('⛔ Denied.');
      const mods = await Moderator.find();
      return ctx.reply(`🛡️ Moderators (${mods.length}):\n` +
        mods.map(m => `• ${m.jid}`).join('\n') || 'None');
    },
  },
  {
    name: 'ban',
    hidden: true,
    async execute(ctx) {
      if (!(await isModerator(ctx.sender))) return ctx.reply('⛔ Denied.');
      const target = ctx.mentionedJids?.[0];
      if (!target) return ctx.reply('Usage: .ban @user');
      const p = await Player.findOne({ jid: target });
      if (!p) return ctx.reply('❌ Player not registered.');
      p.isBanned = true;
      await p.save();
      await Log.create({ actor: ctx.sender, target, command: 'ban', result: 'success' });
      return ctx.reply('✅ Player banned.');
    },
  },
  {
    name: 'unban',
    hidden: true,
    async execute(ctx) {
      if (!(await isModerator(ctx.sender))) return ctx.reply('⛔ Denied.');
      const target = ctx.mentionedJids?.[0];
      if (!target) return ctx.reply('Usage: .unban @user');
      await Player.updateOne({ jid: target }, { isBanned: false });
      await Log.create({ actor: ctx.sender, target, command: 'unban', result: 'success' });
      return ctx.reply('✅ Player unbanned.');
    },
  },
  {
    name: 'botstats',
    hidden: true,
    async execute(ctx) {
      if (!(await isModerator(ctx.sender))) return ctx.reply('⛔ Denied.');
      const players = await Player.countDocuments();
      const groups = await Group.countDocuments();
      const mem = process.memoryUsage();
      return ctx.reply(
`╭━〔 📊 BOT STATS 〕━╮
Players: ${formatNumber(players)}
Groups: ${formatNumber(groups)}
Uptime: ${Math.floor(process.uptime())}s
Memory: ${Math.round(mem.rss / 1024 / 1024)} MB
╰━━━━━━━━━━━━━━━━━━━━╯`);
    },
  },
  {
    name: 'mode',
    hidden: true,
    async execute(ctx) {
      if (!(await isModerator(ctx.sender))) return ctx.reply('⛔ Denied.');
      if (!ctx.isGroup) return ctx.reply('❌ Group only.');
      const mode = (ctx.args[0] || '').toLowerCase();
      if (!['public', 'private'].includes(mode)) return ctx.reply('Usage: .mode private/public');
      let g = await Group.findOne({ jid: ctx.groupJid });
      if (!g) g = await Group.create({ jid: ctx.groupJid });
      g.mode = mode;
      await g.save();
      return ctx.reply(`✅ Group mode set to ${mode.toUpperCase()}.`);
    },
  },
  {
    name: 'broadcast',
    hidden: true,
    async execute(ctx) {
      if (!(await isModerator(ctx.sender))) return ctx.reply('⛔ Denied.');
      const text = ctx.args.join(' ');
      if (!text) return ctx.reply('Usage: .broadcast <message>');
      const groups = await Group.find();
      let sent = 0;
      for (const g of groups) {
        try {
          await ctx.sock.sendMessage(g.jid, { text: `📢 ${text}` });
          sent++;
        } catch {}
      }
      return ctx.reply(`✅ Broadcast sent to ${sent}/${groups.length} groups.`);
    },
  },
];