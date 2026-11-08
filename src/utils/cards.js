const { formatNumber } = require('./helpers');
const { getRank, xpToNextLevel } = require('../config/gameConfig');
const { CLASSES, RACES } = require('../config/gameConfig');
const { getItem } = require('../config/items');

function profileCard(player) {
  const cls = CLASSES[player.class];
  const race = RACES[player.race];
  const rank = getRank(player.level, player.xp);
  const xpNeeded = xpToNextLevel(player.level);
  const xpInLevel = player.xp - (Math.pow(player.level, 2) * 100);

  const eq = player.equipment || {};
  const w = eq.weapon ? getItem(eq.weapon) : null;
  const a = eq.armor ? getItem(eq.armor) : null;
  const acc = eq.accessory ? getItem(eq.accessory) : null;

  return `╭━━━〔 ✧ ADVENTURER PROFILE ✧ 〕━━━╮

                 ❖ ${player.username.toUpperCase()} ❖

   ⚔️ Class       : ${cls.emoji} ${cls.name}
   🧝 Race        : ${race.emoji} ${race.name}
   ✦ Level        : ${player.level}
   ♛ Rank         : ${rank.emoji} ${rank.name}

╭────────〔 📊 STATS 〕────────╮
│ ❤️ HP          : ${formatNumber(player.hp)} / ${formatNumber(player.maxHp)}
│ 🔮 MP          : ${formatNumber(player.mp)} / ${formatNumber(player.maxMp)}
│ ⚔️ Attack      : ${formatNumber(player.attack)}
│ 🛡️ Defense     : ${formatNumber(player.defense)}
│ ⚡ Speed       : ${formatNumber(player.speed)}
│ ✨ Magic       : ${formatNumber(player.magic)}
╰────────────────────────────╯

╭────────〔 🌿 PROGRESS 〕────────╮
│ 📈 EXP         : ${formatNumber(xpInLevel)} / ${formatNumber(xpNeeded)}
│ 🪙 Elven Gold  : ${formatNumber(player.gold)} EG
│ 🏆 Victories   : ${formatNumber(player.victories)}
│ 👹 Monsters    : ${formatNumber(player.monsterKills)}
╰──────────────────────────────╯

╭────────〔 🎒 EQUIPMENT 〕────────╮
│ ⚔️ Weapon      : ${w ? `${w.emoji} ${w.name}` : '—'}
│ 🛡️ Armor       : ${a ? `${a.emoji} ${a.name}` : '—'}
│ 💍 Accessory   : ${acc ? `${acc.emoji} ${acc.name}` : '—'}
╰──────────────────────────────╯

       ✧ The journey never ends ✧
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;
}

function battleCard(battle, player) {
  const hpBar = bar(battle.monsterHp, battle.monsterMaxHp, 10);
  const phpBar = bar(player.hp, player.maxHp, 10);
  return `╭━━━〔 ⚔️ BATTLE 〕━━━╮

👹 ${battle.monsterName}
   HP: ${hpBar} ${battle.monsterHp}/${battle.monsterMaxHp}

vs.

🧙 ${player.username}
   HP: ${phpBar} ${player.hp}/${player.maxHp}
   MP: ${player.mp}/${player.maxMp}

Turn: ${battle.turn}
╰━━━━━━━━━━━━━━━━━━━━━━╯

Reply with:
⚔️ .attack  ✨ .cast <spell>  🛡️ .defend  🏃 .run`;
}

function bar(current, max, size = 10) {
  const pct = Math.max(0, Math.min(1, current / max));
  const filled = Math.round(pct * size);
  return '█'.repeat(filled) + '░'.repeat(size - filled);
}

module.exports = { profileCard, battleCard, bar };