const Group = require('../database/models/Group');

async function getGroup(jid) {
  let g = await Group.findOne({ jid });
  if (!g) g = await Group.create({ jid });
  return g;
}

async function isGroupAdmin(sock, groupJid, userJid) {
  try {
    const meta = await sock.groupMetadata(groupJid);
    return meta.participants.some(p => p.id === userJid && (p.admin === 'admin' || p.admin === 'superadmin'));
  } catch { return false; }
}

function makeToggle(name, description) {
  return {
    name,
    async execute(ctx) {
      if (!ctx.isGroup) return ctx.reply('❌ Group only command.');
      const state = (ctx.args[0] || '').toLowerCase();
      if (!['on', 'off'].includes(state)) return ctx.reply(`Usage: .${name} on/off`);
      if (!(await isGroupAdmin(ctx.sock, ctx.groupJid, ctx.sender))) {
        return ctx.reply('❌ Only group admins can toggle this.');
      }
      const g = await getGroup(ctx.groupJid);
      g.settings[name] = state === 'on';
      await g.save();
      return ctx.reply(`✅ ${description} ${state.toUpperCase()}`);
    },
  };
}

module.exports = [
  makeToggle('antilink', 'Anti-link'),
  makeToggle('antispam', 'Anti-spam'),
  makeToggle('antibadword', 'Anti-badword'),
  makeToggle('antitag', 'Anti-tag'),
  makeToggle('welcome', 'Welcome messages'),
  makeToggle('goodbye', 'Goodbye messages'),
  makeToggle('autoreact', 'Auto-react'),
  {
    name: 'groupinfo',
    async execute(ctx) {
      if (!ctx.isGroup) return ctx.reply('❌ Group only.');
      const meta = await ctx.sock.groupMetadata(ctx.groupJid);
      return ctx.reply(
`╭━〔 🏰 GROUP INFO 〕━╮
Name: ${meta.subject}
Members: ${meta.participants.length}
Owner: ${meta.owner?.split('@')[0] || '—'}
╰━━━━━━━━━━━━━━━━━━━━━╯`);
    },
  },
  {
    name: 'promote',
    async execute(ctx) {
      if (!ctx.isGroup) return ctx.reply('❌ Group only.');
      const target = ctx.mentionedJids?.[0];
      if (!target) return ctx.reply('Usage: .promote @user');
      if (!(await isGroupAdmin(ctx.sock, ctx.groupJid, ctx.sender))) {
        return ctx.reply('❌ Only admins can promote.');
      }
      try {
        await ctx.sock.groupParticipantsUpdate(ctx.groupJid, [target], 'promote');
        return ctx.reply('✅ Promoted.');
      } catch (e) { return ctx.reply(`❌ ${e.message}`); }
    },
  },
  {
    name: 'demote',
    async execute(ctx) {
      if (!ctx.isGroup) return ctx.reply('❌ Group only.');
      const target = ctx.mentionedJids?.[0];
      if (!target) return ctx.reply('Usage: .demote @user');
      if (!(await isGroupAdmin(ctx.sock, ctx.groupJid, ctx.sender))) {
        return ctx.reply('❌ Only admins can demote.');
      }
      try {
        await ctx.sock.groupParticipantsUpdate(ctx.groupJid, [target], 'demote');
        return ctx.reply('✅ Demoted.');
      } catch (e) { return ctx.reply(`❌ ${e.message}`); }
    },
  },
  {
    name: 'kick',
    async execute(ctx) {
      if (!ctx.isGroup) return ctx.reply('❌ Group only.');
      const target = ctx.mentionedJids?.[0];
      if (!target) return ctx.reply('Usage: .kick @user');
      if (!(await isGroupAdmin(ctx.sock, ctx.groupJid, ctx.sender))) {
        return ctx.reply('❌ Only admins can kick.');
      }
      try {
        await ctx.sock.groupParticipantsUpdate(ctx.groupJid, [target], 'remove');
        return ctx.reply('✅ Removed.');
      } catch (e) { return ctx.reply(`❌ ${e.message}`); }
    },
  },
];