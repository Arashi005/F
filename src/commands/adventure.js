const Player = require('../database/models/Player');
const { getRandomMonsterForLevel } = require('../config/monsters');
const { randomInt } = require('../utils/helpers');

module.exports = [
  {
    name: 'explore',
    async execute(ctx) {
      const p = await Player.findOne({ jid: ctx.sender });
      if (!p) return ctx.reply('❌ Not registered.');
      const roll = Math.random();
      if (roll < 0.4) {
        const gold = randomInt(20, 100);
        p.gold += gold;
        await p.save();
        return ctx.reply(`🔍 You found ${gold} EG while exploring!`);
      } else if (roll < 0.7) {
        return ctx.reply(`🌲 You wander the enchanted forest but find nothing.`);
      } else {
        const m = getRandomMonsterForLevel(p.level);
        return ctx.reply(`👀 You spot a ${m.emoji} ${m.name} ahead! Use .hunt to engage.`);
      }
    },
  },
  {
    name: 'quests',
    async execute(ctx) {
      return ctx.reply(
`╭━〔 📜 QUESTS 〕━╮
• Slay 5 goblins
• Win 3 battles
• Explore the forest

Full quest system coming soon!
╰━━━━━━━━━━━━━━━━╯`);
    },
  },
];