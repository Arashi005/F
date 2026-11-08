function formatNumber(n) {
  return Number(n).toLocaleString('en-US');
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chance(p) { return Math.random() < p; }

module.exports = { formatNumber, randomInt, chance };