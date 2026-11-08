const { getSpell, getLearnableSpells } = require('../config/spells');

async function learnSpell(player, spellId) {
  const spell = getSpell(spellId);
  if (!spell) return { error: 'Spell not found.' };
  if (player.knownSpells.includes(spellId)) return { error: 'Already known.' };
  if (player.level < spell.minLevel) return { error: `Requires level ${spell.minLevel}.` };
  player.knownSpells.push(spellId);
  return { success: true, spell };
}

module.exports = { learnSpell, getLearnableSpells };