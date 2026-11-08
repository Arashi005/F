const { CLASSES, RACES, xpForLevel, xpToNextLevel, getRank } = require('../config/gameConfig');

function computeStats(race, cls, level) {
  const r = RACES[race], c = CLASSES[cls];
  const s = { hp: 0, mp: 0, attack: 0, defense: 0, speed: 0, magic: 0 };
  for (const k of Object.keys(s)) {
    s[k] = c.baseStats[k] + c.growthPerLevel[k] * (level - 1) + (r.bonuses[k] || 0);
  }
  return s;
}

async function grantXp(player, amount) {
  const mult = RACES[player.race].xpMultiplier;
  const gained = Math.floor(amount * mult);
  player.xp += gained;
  let levelsGained = 0;
  while (player.xp >= xpForLevel(player.level + 1)) {
    player.level += 1;
    levelsGained += 1;
  }
  if (levelsGained > 0) {
    const stats = computeStats(player.race, player.class, player.level);
    player.maxHp = Math.round(stats.hp);
    player.maxMp = Math.round(stats.mp);
    player.hp = player.maxHp;
    player.mp = player.maxMp;
    player.attack = Math.round(stats.attack);
    player.defense = Math.round(stats.defense);
    player.speed = Math.round(stats.speed);
    player.magic = Math.round(stats.magic);
  }
  return { gained, levelsGained, newRank: getRank(player.level, player.xp) };
}

module.exports = { computeStats, grantXp, xpToNextLevel };