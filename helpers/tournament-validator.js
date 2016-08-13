module.exports = (t) => {
  if (!t.buyIn || isNaN(t.buyIn)) {
    return false;
  }

  if (!t.goNext || !Array.isArray(t.goNext)) {
    return false;
  }

  if (!t.Prizes || !Array.isArray(t.Prizes)) {
    return false;
  }

  if (!t.gameNameID || isNaN(t.gameNameID)) {
    return false;
  }

  if (t.rounds === undefined || t.rounds === null || isNaN(t.rounds)) {
    return false;
  }

  if (!t.settings) {
    return false;
  }

  if (t.settings.regularity && isNaN(t.settings.regularity)) {
    return false;
  }

  // need more research for validity (not only type checking, but also range checking)
  // for example: gameNameID cannot be equal to 100, cause we have just three games

  return true;
};
