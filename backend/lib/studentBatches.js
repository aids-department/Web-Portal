// The latest 4 distinct pass-out batches are current students (newest = year 1,
// oldest of the four = year 4). Any earlier batch is alumni.
function computeRoleAndYear(passOutYear, allPassOutYears) {
  const pYear = parseInt(passOutYear, 10);
  if (isNaN(pYear)) return { role: 'user', year: '1' };

  const uniqueBatches = Array.from(
    new Set(allPassOutYears.map((y) => parseInt(y, 10)).filter((n) => !isNaN(n)))
  ).sort((a, b) => b - a);

  const idx = uniqueBatches.slice(0, 4).indexOf(pYear);
  if (idx !== -1) return { role: 'user', year: String(idx + 1) };
  return { role: 'alumni', year: '4' };
}

module.exports = { computeRoleAndYear };
