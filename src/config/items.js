const ITEMS = {
  // Consumables
  healing_potion: {
    id: 'healing_potion', name: 'Healing Potion', emoji: '🧪',
    type: 'consumable', rarity: 'common', price: 50,
    effect: { hp: 100 },
    description: 'Restores 100 HP.',
  },
  mana_potion: {
    id: 'mana_potion', name: 'Mana Potion', emoji: '🧴',
    type: 'consumable', rarity: 'common', price: 60,
    effect: { mp: 80 },
    description: 'Restores 80 MP.',
  },
  // Weapons
  wooden_staff: {
    id: 'wooden_staff', name: 'Wooden Staff', emoji: '🪵',
    type: 'weapon', slot: 'weapon', rarity: 'common', price: 100,
    stats: { attack: 8, magic: 15 },
    description: 'A simple apprentice staff.',
  },
  iron_sword: {
    id: 'iron_sword', name: 'Iron Sword', emoji: '🗡️',
    type: 'weapon', slot: 'weapon', rarity: 'common', price: 150,
    stats: { attack: 20 },
    description: 'A dependable iron blade.',
  },
  hunting_bow: {
    id: 'hunting_bow', name: 'Hunting Bow', emoji: '🏹',
    type: 'weapon', slot: 'weapon', rarity: 'common', price: 140,
    stats: { attack: 15, speed: 10 },
    description: 'A lightweight bow.',
  },
  // Armor
  leather_armor: {
    id: 'leather_armor', name: 'Leather Armor', emoji: '🦺',
    type: 'armor', slot: 'armor', rarity: 'common', price: 120,
    stats: { defense: 15, hp: 30 },
    description: 'Basic leather protection.',
  },
  elven_robes: {
    id: 'elven_robes', name: 'Elven Robes', emoji: '🥋',
    type: 'armor', slot: 'armor', rarity: 'rare', price: 500,
    stats: { defense: 20, magic: 30, mp: 50 },
    description: 'Enchanted elven garments.',
  },
  // Accessories
  mana_ring: {
    id: 'mana_ring', name: 'Mana Ring', emoji: '💍',
    type: 'accessory', slot: 'accessory', rarity: 'uncommon', price: 300,
    stats: { mp: 40, magic: 10 },
    description: 'A ring that channels mana.',
  },
  // Rare
  arcane_staff: {
    id: 'arcane_staff', name: 'Arcane Staff', emoji: '🪄',
    type: 'weapon', slot: 'weapon', rarity: 'epic', price: 2500,
    stats: { attack: 30, magic: 75, mp: 60 },
    description: 'A staff imbued with ancient magic.',
  },
  hero_blade: {
    id: 'hero_blade', name: "Hero's Blade", emoji: '⚔️',
    type: 'weapon', slot: 'weapon', rarity: 'legendary', price: 8000,
    stats: { attack: 90, defense: 20 },
    description: 'A blade once wielded by a legendary hero.',
  },
};

const SHOP_ITEMS = Object.values(ITEMS).filter(i => i.price <= 3000);
function getItem(id) { return ITEMS[id]; }

module.exports = { ITEMS, SHOP_ITEMS, getItem };