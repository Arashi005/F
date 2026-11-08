const character = require('./character');
const combat = require('./combat');
const magic = require('./magic');
const economy = require('./economy');
const inventory = require('./inventory');
const adventure = require('./adventure');
const group = require('./group');
const moderator = require('./moderator');
const owner = require('./owner');
const system = require('./system');

const registry = new Map();

function register(commands, category) {
  for (const cmd of commands) {
    cmd.category = category;
    registry.set(cmd.name, cmd);
  }
}

register(character, 'character');
register(combat, 'combat');
register(magic, 'magic');
register(economy, 'economy');
register(inventory, 'inventory');
register(adventure, 'adventure');
register(group, 'group');
register(moderator, 'moderator');
register(owner, 'owner');
register(system, 'system');

module.exports = registry;