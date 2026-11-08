const SPELLS = {
  fireball: {
    id: 'fireball', name: 'Fireball', emoji: '🔥',
    category: 'offensive', manaCost: 15, power: 30,
    description: 'A basic offensive fire spell.', minLevel: 1,
  },
  mana_shield: {
    id: 'mana_shield', name: 'Mana Shield', emoji: '🛡️',
    category: 'defensive', manaCost: 12, effect: 'defense_boost', power: 20, duration: 2,
    description: 'Raises defense for 2 turns.', minLevel: 1,
  },
  heal: {
    id: 'heal', name: 'Heal', emoji: '💚',
    category: 'healing', manaCost: 20, power: 60,
    description: 'Restores HP.', minLevel: 1,
  },
  blessing: {
    id: 'blessing', name: 'Blessing', emoji: '✨',
    category: 'support', manaCost: 25, effect: 'attack_boost', power: 15, duration: 3,
    description: 'Raises attack for 3 turns.', minLevel: 1,
  },
  precise_shot: {
    id: 'precise_shot', name: 'Precise Shot', emoji: '🎯',
    category: 'offensive', manaCost: 10, power: 40,
    description: 'Ignores 50% of enemy defense.', minLevel: 1,
    ignoreDefense: 0.5,
  },
  ice_lance: {
    id: 'ice_lance', name: 'Ice Lance', emoji: '❄️',
    category: 'offensive', manaCost: 25, power: 55,
    description: 'A piercing ice spell.', minLevel: 8,
  },
  thunder_strike: {
    id: 'thunder_strike', name: 'Thunder Strike', emoji: '⚡',
    category: 'offensive', manaCost: 35, power: 75,
    description: 'Calls down lightning.', minLevel: 15,
  },
  greater_heal: {
    id: 'greater_heal', name: 'Greater Heal', emoji: '💖',
    category: 'healing', manaCost: 40, power: 150,
    description: 'Substantial healing.', minLevel: 20,
  },
  zoltraak: {
    id: 'zoltraak', name: 'Zoltraak', emoji: '💫',
    category: 'offensive', manaCost: 60, power: 180,
    description: 'A legendary killing spell taught by the great mages.', minLevel: 40,
  },
  ancient_barrier: {
    id: 'ancient_barrier', name: 'Ancient Barrier', emoji: '🔰',
    category: 'defensive', manaCost: 50, effect: 'defense_boost', power: 80, duration: 3,
    description: 'Powerful ancient protective ward.', minLevel: 45,
  },
  meteor: {
    id: 'meteor', name: 'Meteor', emoji: '☄️',
    category: 'offensive', manaCost: 100, power: 400,
    description: 'Summons a devastating meteor.', minLevel: 55,
  },
};

function getSpell(id) { return SPELLS[id]; }
function getLearnableSpells(level, knownSpells = []) {
  return Object.values(SPELLS).filter(s =>
    s.minLevel <= level && !knownSpells.includes(s.id)
  );
}

module.exports = { SPELLS, getSpell, getLearnableSpells };