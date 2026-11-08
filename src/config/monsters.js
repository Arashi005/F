// 12+ monsters spanning low to high tier
const MONSTERS = {
  slime: {
    id: 'slime', name: 'Forest Slime', emoji: '🟢', tier: 1,
    hp: 60, attack: 12, defense: 5, speed: 8,
    xpReward: 25, goldReward: 15, minLevel: 1,
  },
  goblin: {
    id: 'goblin', name: 'Goblin Scout', emoji: '👺', tier: 1,
    hp: 90, attack: 18, defense: 8, speed: 14,
    xpReward: 40, goldReward: 25, minLevel: 2,
  },
  wolf: {
    id: 'wolf', name: 'Shadow Wolf', emoji: '🐺', tier: 2,
    hp: 130, attack: 28, defense: 12, speed: 25,
    xpReward: 70, goldReward: 45, minLevel: 5,
  },
  bandit: {
    id: 'bandit', name: 'Highway Bandit', emoji: '🗡️', tier: 2,
    hp: 160, attack: 32, defense: 18, speed: 20,
    xpReward: 90, goldReward: 60, minLevel: 7,
  },
  skeleton: {
    id: 'skeleton', name: 'Cursed Skeleton', emoji: '💀', tier: 2,
    hp: 200, attack: 38, defense: 25, speed: 15,
    xpReward: 120, goldReward: 80, minLevel: 10,
  },
  ogre: {
    id: 'ogre', name: 'Cave Ogre', emoji: '👹', tier: 3,
    hp: 400, attack: 55, defense: 35, speed: 10,
    xpReward: 250, goldReward: 180, minLevel: 15,
  },
  wraith: {
    id: 'wraith', name: 'Ancient Wraith', emoji: '👻', tier: 3,
    hp: 320, attack: 65, defense: 20, speed: 40,
    xpReward: 300, goldReward: 200, minLevel: 18,
  },
  chimera: {
    id: 'chimera', name: 'Chimera Beast', emoji: '🦁', tier: 3,
    hp: 520, attack: 70, defense: 45, speed: 30,
    xpReward: 420, goldReward: 300, minLevel: 22,
  },
  demon_knight: {
    id: 'demon_knight', name: 'Demon Knight', emoji: '😈', tier: 4,
    hp: 750, attack: 95, defense: 70, speed: 35,
    xpReward: 700, goldReward: 500, minLevel: 30,
  },
  dragon_whelp: {
    id: 'dragon_whelp', name: 'Dragon Whelp', emoji: '🐲', tier: 4,
    hp: 950, attack: 110, defense: 80, speed: 45,
    xpReward: 950, goldReward: 700, minLevel: 35,
  },
  ancient_guardian: {
    id: 'ancient_guardian', name: 'Ancient Guardian', emoji: '🗿', tier: 5,
    hp: 1500, attack: 140, defense: 120, speed: 25,
    xpReward: 1600, goldReward: 1200, minLevel: 45,
  },
  demon_general: {
    id: 'demon_general', name: 'Demon General', emoji: '👿', tier: 5,
    hp: 2000, attack: 175, defense: 140, speed: 60,
    xpReward: 2500, goldReward: 2000, minLevel: 55,
  },
  // Bosses
  boss_qual: {
    id: 'boss_qual', name: 'Qual, the Sage of Destruction', emoji: '☠️', tier: 6,
    hp: 4500, attack: 220, defense: 180, speed: 90,
    xpReward: 8000, goldReward: 6000, minLevel: 60, isBoss: true,
  },
  boss_aura: {
    id: 'boss_aura', name: 'Aura the Guillotine', emoji: '🌙', tier: 6,
    hp: 6000, attack: 260, defense: 200, speed: 100,
    xpReward: 12000, goldReward: 9000, minLevel: 70, isBoss: true,
  },
};

function getRandomMonsterForLevel(level, allowBoss = false) {
  const pool = Object.values(MONSTERS).filter(m =>
    !m.isBoss && m.minLevel <= level && m.tier <= Math.ceil(level / 8) + 1
  );
  if (allowBoss) {
    const bosses = Object.values(MONSTERS).filter(m => m.isBoss && m.minLevel <= level);
    if (bosses.length && Math.random() < 0.1) {
      return bosses[Math.floor(Math.random() * bosses.length)];
    }
  }
  return pool[Math.floor(Math.random() * pool.length)] || MONSTERS.slime;
}

module.exports = { MONSTERS, getRandomMonsterForLevel };