const { randomInt, chance } = require('../utils/helpers');

function damage(attacker, defender, options = {}) {
  const isMagic = options.magic || false;
  const power = isMagic ? attacker.magic : attacker.attack;
  const def = isMagic ? Math.floor(defender.defense * 0.5) : defender.defense;
  const base = Math.max(1, power - def * 0.6);
  const variance = base * (0.85 + Math.random() * 0.3);
  const crit = chance(0.1) ? 1.5 : 1;
  return { damage: Math.round(variance * crit), crit: crit > 1 };
}

function playerTurn(player, monster, action) {
  const log = [];
  if (action.type === 'attack') {
    const { damage: dmg, crit } = damage(player, monster, { magic: false });
    monster.hp -= dmg;
    log.push(`${crit ? '💥 CRITICAL! ' : ''}You hit ${monster.name} for ${dmg} damage!`);
  } else if (action.type === 'cast' && action.spell) {
    const s = action.spell;
    if (player.mp < s.manaCost) {
      return { error: 'Not enough MP!' };
    }
    player.mp -= s.manaCost;
    if (s.category === 'healing') {
      player.hp = Math.min(player.maxHp, player.hp + s.power);
      log.push(`💚 You cast ${s.name} and healed for ${s.power} HP!`);
    } else if (s.category === 'offensive') {
      const { damage: dmg, crit } = damage(player, monster, { magic: true });
      const total = dmg + Math.floor(s.power / 2);
      monster.hp -= total;
      log.push(`${crit ? '💥 ' : ''}You cast ${s.name} for ${total} damage!`);
    } else if (s.category === 'defensive' || s.category === 'support') {
      log.push(`✨ You cast ${s.name}.`);
    }
  } else if (action.type === 'defend') {
    player._defending = true;
    log.push('🛡️ You raise your guard.');
  }
  return { log };
}

function monsterTurn(player, monster) {
  const log = [];
  const { damage: dmg, crit } = damage(monster, player, { magic: false });
  const actual = player._defending ? Math.floor(dmg * 0.5) : dmg;
  player.hp -= actual;
  log.push(`${crit ? '💥 ' : ''}${monster.name} hits you for ${actual} damage!`);
  return { log };
}

module.exports = { playerTurn, monsterTurn, damage };