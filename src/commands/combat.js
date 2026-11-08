const Player = require('../database/models/Player');
const Battle = require('../database/models/Battle');
const { getRandomMonsterForLevel, MONSTERS } = require('../config/monsters');
const { playerTurn, monsterTurn } = require('../systems/combatEngine');
const { grantXp } = require('../systems/levelEngine');
const { getSpell } = require('../config/spells');
const { battleCard } = require('../utils/cards');
const { formatNumber } = require('../utils/helpers');

async function getActiveBattle(jid) {
  return Battle.findOne({ playerJid: jid, status: 'active' });
}

async function resolveBattle(ctx, action) {
  const p = await Player.findOne({ jid: ctx.sender });
  if (!p) return ctx.reply('❌ Not registered.');
  const battle = await getActiveBattle(ctx.sender);
  if (!battle) return ctx.reply('❌ No active battle. Use `.hunt`.');

  const monster = {
    name: battle.monsterName,
    hp: battle.monsterHp,
    attack: battle.monsterAttack,
    defense: battle.monsterDefense,
    speed: battle.monsterSpeed,
  };

  const pTurn = playerTurn(p, monster, action);
  if (pTurn.error) return ctx.reply(`⚠️ ${pTurn.error}`);

  let mTurn = { log: [] };
  if (monster.hp > 0) mTurn = monsterTurn(p, monster);

  battle.monsterHp = Math.max(0, monster.hp);
  battle.turn += 1;
  battle.log.push(...pTurn.log, ...mTurn.log);

  p.hp = Math.max(0, p.hp);
  p._defending = false;

  if (monster.hp <= 0) {
    battle.status = 'victory';
    const xpResult = await grantXp(p, battle.xpReward || 50);
    p.gold += battle.goldReward || 20;
    p.victories += 1;
    p.monsterKills += 1;
    await p.save();
    await battle.save();
    return ctx.reply(
`╭━━━〔 🏆 VICTORY 〕━━━╮

You defeated ${battle.monsterName}!

+${xpResult.gained} XP
+${battle.goldReward || 20} EG
${xpResult.levelsGained > 0 ? `\n🎉 LEVEL UP! Now level ${p.level}` : ''}
╰━━━━━━━━━━━━━━━━━━━━━╯`);
  }
  if (p.hp <= 0) {
    battle.status = 'defeat';
    p.hp = 1;
    await p.save();
    await battle.save();
    return ctx.reply(`💀 You were defeated by ${battle.monsterName}...`);
  }
  await p.save();
  await battle.save();

  return ctx.reply(
`${pTurn.log.join('\n')}\n${mTurn.log.join('\n')}

${battleCard({
    monsterName: battle.monsterName,
    monsterHp: battle.monsterHp,
    monsterMaxHp: battle.monsterMaxHp,
    turn: battle.turn,
  }, p)}`);
}

module.exports = [
  {
    name: 'hunt',
    async execute(ctx) {
      const p = await Player.findOne({ jid: ctx.sender });
      if (!p) return ctx.reply('❌ Not registered.');
      const existing = await getActiveBattle(ctx.sender);
      if (existing) return ctx.reply('⚠️ Finish your current battle first.');

      const m = getRandomMonsterForLevel(p.level);
      const battle = await Battle.create({
        playerJid: ctx.sender,
        monsterId: m.id,
        monsterName: m.name,
        monsterHp: m.hp,
        monsterMaxHp: m.hp,
        monsterAttack: m.attack,
        monsterDefense: m.defense,
        monsterSpeed: m.speed,
        xpReward: m.xpReward,
        goldReward: m.goldReward,
      });
      return ctx.reply(
`⚔️ A wild ${m.emoji} ${m.name} appears!

${battleCard({
    monsterName: m.name,
    monsterHp: m.hp,
    monsterMaxHp: m.hp,
    turn: 1,
  }, p)}`);
    },
  },
  {
    name: 'attack',
    async execute(ctx) { return resolveBattle(ctx, { type: 'attack' }); },
  },
  {
    name: 'defend',
    async execute(ctx) { return resolveBattle(ctx, { type: 'defend' }); },
  },
  {
    name: 'cast',
    async execute(ctx) {
      const spellId = (ctx.args[0] || '').toLowerCase();
      if (!spellId) return ctx.reply('Usage: .cast <spell>');
      const p = await Player.findOne({ jid: ctx.sender });
      const spell = getSpell(spellId);
      if (!spell) return ctx.reply('❌ Unknown spell.');
      if (!p.knownSpells.includes(spellId)) return ctx.reply('❌ You have not learned that spell.');
      return resolveBattle(ctx, { type: 'cast', spell });
    },
  },
  {
    name: 'run',
    async execute(ctx) {
      const battle = await getActiveBattle(ctx.sender);
      if (!battle) return ctx.reply('❌ No active battle.');
      battle.status = 'escaped';
      await battle.save();
      return ctx.reply('🏃 You escaped safely.');
    },
  },
];