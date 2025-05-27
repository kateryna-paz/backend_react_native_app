function normalizeDateString(date) {
  return new Date(date).toISOString().split("T")[0];
}

function getDayRange(date) {
  const normalized = normalizeDateString(date);
  return {
    startOfDay: new Date(`${normalized}T00:00:00.000Z`),
    endOfDay: new Date(`${normalized}T23:59:59.999Z`),
  };
}

module.exports = { normalizeDateString, getDayRange };
