const { profileCard } = require('../utils/cards');

module.exports = [
  {
    name: 'menu',
    async execute(ctx) {
      return ctx.reply(
`╭━━━━〔 ✧ FRIEREN ✧ 〕━━━━╮
   𝘌𝘵𝘦𝘳𝘯𝘢𝘭 𝘑𝘰𝘶𝘳𝘯𝘦𝘺

📜 CHARACTER
 .register <race> <class>
 .profile  .stats  .class
 .race  .rank

⚔️ ADVENTURE
 .hunt  .explore
 .quests

✨ COMBAT
 .attack  .cast <spell>
 .defend  .run

📖 MAGIC
 .magic  .learn

🪙 ECONOMY
 .balance  .daily  .work
 .transfer @user <amt>

🎒 INVENTORY
 .inventory  .shop  .buy
 .equip  .equipment  .use

🏰 GROUP
 .antilink on/off
 .welcome on/off
 .promote  .demote  .kick
 .groupinfo

⚙️ SYSTEM
 .menu  .ping  .runtime
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯
Prefix: .
✧ The journey never ends ✧`);
    },
  },
  {
    name: 'help',
    async execute(ctx) { return ctx.dispatch('menu'); },
  },
  {
    name: 'ping',
    async execute(ctx) {
      const t = Date.now();
      await ctx.reply('🏓 Pong!');
      return ctx.reply?.(`⚡ Latency: ${Date.now() - t}ms`);
    },
  },
  {
    name: 'runtime',
    async execute(ctx) {
      const u = process.uptime();
      const h = Math.floor(u / 3600);
      const m = Math.floor((u % 3600) / 60);
      return ctx.reply(`⏱️ Runtime: ${h}h ${m}m`);
    },
  },
];