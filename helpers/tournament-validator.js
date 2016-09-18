// return error if it has it.
module.exports = (t) => {
  // var mask = {};
  if (isNaN(t.buyIn)) {
    return 'buyIn';
  }
  // mask.buyIn = parseInt(t.buyIn, 10);

  if (!t.goNext || !Array.isArray(t.goNext)) {
    return 'goNext';
  }

  if (!t.Prizes || !Array.isArray(t.Prizes)) {
    return 'Prizes';
  }

  if (!t.gameNameID || isNaN(t.gameNameID)) {
    return 'gameNameID';
  }

  if (t.rounds === undefined || t.rounds === null || isNaN(t.rounds)) {
    return 'rounds';
  }

  if (!t.settings) {
    return 'settings';
  }

  if (t.settings.regularity && isNaN(t.settings.regularity)) {
    return 'regularity';
  }

  // need more research for validity (not only type checking, but also range checking)
  // for example: gameNameID cannot be equal to 100, cause we have just three games

  return false;
};
