const Player = require('../database/models/Player');
const { computeStats, grantXp } = require('../systems/levelEngine');
const { RACES, CLASSES, getRank } = require('../config/gameConfig');
const { profileCard } = require('../utils/cards');
const { formatNumber } = require('../utils/helpers');

module.exports = [
  {
    name: 'register',
    description: 'Create your adventurer.',
    async execute(ctx) {
      const existing = await Player.findOne({ jid: ctx.sender });
      if (existing) return ctx.reply('⚠️ You are already registered. Use `.profile`.');

      const [, raceArg, classArg] = ctx.args;
      if (!raceArg || !classArg) {
        return ctx.reply(
`╭━━━〔 📜 REGISTRATION 〕━━━╮

Usage: .register <race> <class>

🧝 Races:  human, elf, dwarf
⚔️ Classes: mage, warrior, priest, archer

Example:
  .register elf mage
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯`);
      }
      const race = raceArg.toLowerCase();
      const cls = classArg.toLowerCase();
      if (!RACES[race]) return ctx.reply('❌ Invalid race.');
      if (!CLASSES[cls]) return ctx.reply('❌ Invalid class.');

      const stats = computeStats(race, cls, 1);
      const player = await Player.create({
        jid: ctx.sender,
        username: ctx.pushName || 'Adventurer',
        race, class: cls,
        level: 1, xp: 0,
        maxHp: stats.hp, hp: stats.hp,
        maxMp: stats.mp, mp: stats.mp,
        attack: stats.attack, defense: stats.defense,
        speed: stats.speed, magic: stats.magic,
        gold: 500,
        knownSpells: [...CLASSES[cls].startsWithSpells],
      });
      return ctx.reply(
`✅ Registration complete!

Welcome, ${player.username}!
╭━〔 STARTING STATS 〕━╮
❤️ HP: ${stats.hp}
🔮 MP: ${stats.mp}
⚔️ Attack: ${stats.attack}
✨ Magic: ${stats.magic}
🪙 Gold: 500 EG
╰━━━━━━━━━━━━━━━━━━━╯

Use .profile to view your adventurer.`);
    },
  },
  {
    name: 'profile',
    description: 'View your adventurer profile.',
    async execute(ctx) {
      const p = await Player.findOne({ jid: ctx.sender });
      if (!p) return ctx.reply('❌ Not registered. Use `.register <race> <class>`.');
      return ctx.reply(profileCard(p));
    },
  },
  {
    name: 'stats',
    description: 'View detailed stats.',
    async execute(ctx) {
      const p = await Player.findOne({ jid: ctx.sender });
      if (!p) return ctx.reply('❌ Not registered.');
      return ctx.reply(
`╭━━━〔 📊 STATS 〕━━━╮
❤️ HP: ${p.hp}/${p.maxHp}
🔮 MP: ${p.mp}/${p.maxMp}
⚔️ Attack: ${p.attack}
🛡️ Defense: ${p.defense}
⚡ Speed: ${p.speed}
✨ Magic: ${p.magic}
🎯 Level: ${p.level}
📈 XP: ${formatNumber(p.xp)}
╰━━━━━━━━━━━━━━━━━━━━╯`);
    },
  },
  {
    name: 'class',
    description: 'Show class info.',
    async execute(ctx) {
      const p = await Player.findOne({ jid: ctx.sender });
      if (!p) return ctx.reply('❌ Not registered.');
      const c = CLASSES[p.class];
      return ctx.reply(
`${c.emoji} ${c.name}
${c.description}

Base stats:
HP ${c.baseStats.hp} | MP ${c.baseStats.mp}
ATK ${c.baseStats.attack} | DEF ${c.baseStats.defense}`);
    },
  },
  {
    name: 'race',
    description: 'Show race info.',
    async execute(ctx) {
      const p = await Player.findOne({ jid: ctx.sender });
      if (!p) return ctx.reply('❌ Not registered.');
      const r = RACES[p.race];
      return ctx.reply(
`${r.emoji} ${r.name}
${r.description}

Bonuses:
HP ${r.bonuses.hp} | MP ${r.bonuses.mp}
ATK ${r.bonuses.attack} | DEF ${r.bonuses.defense}
SPD ${r.bonuses.speed} | MAG ${r.bonuses.magic}`);
    },
  },
  {
    name: 'rank',
    description: 'View your rank.',
    async execute(ctx) {
      const p = await Player.findOne({ jid: ctx.sender });
      if (!p) return ctx.reply('❌ Not registered.');
      const r = getRank(p.level, p.xp);
      return ctx.reply(
`╭━〔 ♛ RANK 〕━╮
${r.emoji} ${r.name}
Level ${p.level} | XP ${formatNumber(p.xp)}
╰━━━━━━━━━━━━━━╯`);
    },
  },
];