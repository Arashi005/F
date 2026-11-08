const Player = require('../database/models/Player');
const { SHOP_ITEMS, getItem } = require('../config/items');
const { formatNumber } = require('../utils/helpers');

function addItem(player, itemId, qty = 1) {
  const entry = player.inventory.find(i => i.itemId === itemId);
  if (entry) entry.quantity += qty;
  else player.inventory.push({ itemId, quantity: qty });
}

function removeItem(player, itemId, qty = 1) {
  const entry = player.inventory.find(i => i.itemId === itemId);
  if (!entry || entry.quantity < qty) return false;
  entry.quantity -= qty;
  if (entry.quantity <= 0) {
    player.inventory = player.inventory.filter(i => i.itemId !== itemId);
  }
  return true;
}

module.exports = [
  {
    name: 'inventory',
    async execute(ctx) {
      const p = await Player.findOne({ jid: ctx.sender });
      if (!p) return ctx.reply('❌ Not registered.');
      if (!p.inventory.length) return ctx.reply('🎒 Your inventory is empty.');
      const lines = p.inventory.map(i => {
        const it = getItem(i.itemId);
        return it ? `${it.emoji} ${it.name} ×${i.quantity}` : `${i.itemId} ×${i.quantity}`;
      }).join('\n');
      return ctx.reply(`╭━〔 🎒 INVENTORY 〕━╮\n${lines}\n╰━━━━━━━━━━━━━━━━━━━╯`);
    },
  },
  {
    name: 'shop',
    async execute(ctx) {
      const lines = SHOP_ITEMS.map(i =>
        `${i.emoji} ${i.name} — ${formatNumber(i.price)} EG\n   .buy ${i.id}`
      ).join('\n\n');
      return ctx.reply(`╭━〔 🏪 SHOP 〕━╮\n\n${lines}\n╰━━━━━━━━━━━━━━━╯`);
    },
  },
  {
    name: 'buy',
    async execute(ctx) {
      const itemId = (ctx.args[0] || '').toLowerCase();
      const item = getItem(itemId);
      if (!item) return ctx.reply('❌ Item not found.');
      const p = await Player.findOne({ jid: ctx.sender });
      if (!p) return ctx.reply('❌ Not registered.');
      if (p.gold < item.price) return ctx.reply('❌ Not enough gold.');
      p.gold -= item.price;
      addItem(p, itemId, 1);
      await p.save();
      return ctx.reply(`✅ Bought ${item.name} for ${formatNumber(item.price)} EG.`);
    },
  },
  {
    name: 'equip',
    async execute(ctx) {
      const itemId = (ctx.args[0] || '').toLowerCase();
      const item = getItem(itemId);
      if (!item) return ctx.reply('❌ Item not found.');
      if (!item.slot) return ctx.reply('❌ This item cannot be equipped.');
      const p = await Player.findOne({ jid: ctx.sender });
      const entry = p.inventory.find(i => i.itemId === itemId);
      if (!entry) return ctx.reply('❌ You do not own that item.');
      p.equipment[item.slot] = itemId;
      await p.save();
      return ctx.reply(`✅ Equipped ${item.emoji} ${item.name}.`);
    },
  },
  {
    name: 'equipment',
    async execute(ctx) {
      const p = await Player.findOne({ jid: ctx.sender });
      if (!p) return ctx.reply('❌ Not registered.');
      const eq = p.equipment || {};
      const fmt = id => (id && getItem(id)) ? `${getItem(id).emoji} ${getItem(id).name}` : '—';
      return ctx.reply(
`╭━〔 🎒 EQUIPMENT 〕━╮
⚔️ Weapon: ${fmt(eq.weapon)}
🛡️ Armor:  ${fmt(eq.armor)}
💍 Access: ${fmt(eq.accessory)}
╰━━━━━━━━━━━━━━━━━━━╯`);
    },
  },
  {
    name: 'use',
    async execute(ctx) {
      const itemId = (ctx.args[0] || '').toLowerCase();
      const item = getItem(itemId);
      if (!item || item.type !== 'consumable') return ctx.reply('❌ Not a usable item.');
      const p = await Player.findOne({ jid: ctx.sender });
      if (!removeItem(p, itemId)) return ctx.reply('❌ You do not own that item.');
      if (item.effect.hp) p.hp = Math.min(p.maxHp, p.hp + item.effect.hp);
      if (item.effect.mp) p.mp = Math.min(p.maxMp, p.mp + item.effect.mp);
      await p.save();
      return ctx.reply(`✅ Used ${item.name}.`);
    },
  },
];