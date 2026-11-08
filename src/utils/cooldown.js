const cooldowns = new Map();

function setCooldown(key, ms) {
  cooldowns.set(key, Date.now() + ms);
}

function getRemaining(key) {
  const until = cooldowns.get(key);
  if (!until) return 0;
  const left = until - Date.now();
  if (left <= 0) { cooldowns.delete(key); return 0; }
  return left;
}

function formatCooldown(ms) {
  const s = Math.ceil(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.ceil(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.ceil(m / 60);
  return `${h}h`;
}

module.exports = { setCooldown, getRemaining, formatCooldown };