const Player = require('../database/models/Player');
const { getSpell, getLearnableSpells } = require('../config/spells');
const { learnSpell } = require('../systems/magicEngine');

module.exports = [
  {
    name: 'magic',
    async execute(ctx) {
      const p = await Player.findOne({ jid: ctx.sender });
      if (!p) return ctx.reply('❌ Not registered.');
      const lines = p.knownSpells.length
        ? p.knownSpells.map(id => {
            const s = getSpell(id);
            return s ? `✨ ${s.emoji} ${s.name} — ${s.manaCost} MP` : id;
          }).join('\n')
        : '_No spells learned yet._';
      return ctx.reply(
`╭━━━〔 📖 SPELLBOOK 〕━━━╮
MP: ${p.mp}/${p.maxMp}

${lines}
╰━━━━━━━━━━━━━━━━━━━━━━━╯

Learn more: .learn`);
    },
  },
  {
    name: 'learn',
    async execute(ctx) {
      const p = await Player.findOne({ jid: ctx.sender });
      if (!p) return ctx.reply('❌ Not registered.');
      const spellId = (ctx.args[0] || '').toLowerCase();
      if (!spellId) {
        const learnable = getLearnableSpells(p.level, p.knownSpells);
        if (!learnable.length) return ctx.reply('✨ No spells available at your level.');
        return ctx.reply(
`📖 Learnable spells:\n\n` +
          learnable.map(s => `${s.emoji} ${s.id} — ${s.name} (Lv.${s.minLevel})`).join('\n') +
          `\n\nUse: .learn <spell>`);
      }
      const result = await learnSpell(p, spellId);
      if (result.error) return ctx.reply(`❌ ${result.error}`);
      await p.save();
      return ctx.reply(`✨ You learned ${result.spell.name}!`);
    },
  },
];