// Core RPG formulas and constants

const RACES = {
  human: {
    name: 'Human',
    emoji: '🧑',
    description: 'Balanced and adaptable.',
    bonuses: { hp: 0, mp: 0, attack: 5, defense: 5, speed: 5, magic: 5 },
    xpMultiplier: 1.0,
  },
  elf: {
    name: 'Elf',
    emoji: '🧝',
    description: 'Agile and magically gifted.',
    bonuses: { hp: -20, mp: 50, attack: 0, defense: 0, speed: 15, magic: 20 },
    xpMultiplier: 1.1,
  },
  dwarf: {
    name: 'Dwarf',
    emoji: '🧔',
    description: 'Sturdy and resilient.',
    bonuses: { hp: 80, mp: -30, attack: 10, defense: 15, speed: -5, magic: -10 },
    xpMultiplier: 0.95,
  },
};

const CLASSES = {
  mage: {
    name: 'Mage',
    emoji: '🔮',
    description: 'Master of offensive magic.',
    baseStats: { hp: 180, mp: 150, attack: 25, defense: 20, speed: 30, magic: 60 },
    growthPerLevel: { hp: 12, mp: 15, attack: 3, defense: 2, speed: 3, magic: 8 },
    startsWithSpells: ['fireball', 'mana_shield'],
  },
  warrior: {
    name: 'Warrior',
    emoji: '⚔️',
    description: 'Frontline combat specialist.',
    baseStats: { hp: 280, mp: 50, attack: 55, defense: 45, speed: 25, magic: 10 },
    growthPerLevel: { hp: 25, mp: 4, attack: 8, defense: 6, speed: 2, magic: 1 },
    startsWithSpells: [],
  },
  priest: {
    name: 'Priest',
    emoji: '⛪',
    description: 'Healer and support caster.',
    baseStats: { hp: 200, mp: 120, attack: 20, defense: 30, speed: 25, magic: 50 },
    growthPerLevel: { hp: 15, mp: 12, attack: 2, defense: 4, speed: 2, magic: 6 },
    startsWithSpells: ['heal', 'blessing'],
  },
  archer: {
    name: 'Archer',
    emoji: '🏹',
    description: 'High-speed precision fighter.',
    baseStats: { hp: 220, mp: 70, attack: 45, defense: 25, speed: 50, magic: 20 },
    growthPerLevel: { hp: 18, mp: 5, attack: 6, defense: 3, speed: 7, magic: 2 },
    startsWithSpells: ['precise_shot'],
  },
};

const RANKS = [
  { name: 'Iron',         emoji: '⚙️',  minLevel: 1,  minXp: 0 },
  { name: 'Bronze',       emoji: '🥉',  minLevel: 5,  minXp: 1000 },
  { name: 'Silver',       emoji: '🥈',  minLevel: 15, minXp: 8000 },
  { name: 'Gold',         emoji: '🥇',  minLevel: 25, minXp: 25000 },
  { name: 'Platinum',     emoji: '💠',  minLevel: 40, minXp: 70000 },
  { name: 'Diamond',      emoji: '💎',  minLevel: 55, minXp: 150000 },
  { name: 'First-Class Mage', emoji: '👑', minLevel: 70, minXp: 300000, requiresExam: true },
];

// XP required to reach a given level (cumulative)
function xpForLevel(level) {
  if (level <= 1) return 0;
  // Smooth curve: level^2 * 100
  return Math.floor(Math.pow(level, 2) * 100);
}

function xpToNextLevel(level) {
  return xpForLevel(level + 1) - xpForLevel(level);
}

function getRank(level, totalXp) {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (level >= r.minLevel && totalXp >= r.minXp) rank = r;
  }
  return rank;
}

module.exports = {
  RACES,
  CLASSES,
  RANKS,
  xpForLevel,
  xpToNextLevel,
  getRank,
  PREFIX: process.env.PREFIX || '.',
};