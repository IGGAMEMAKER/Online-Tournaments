var constants = require('../constants');
// import { isToday, isTomorrow } from './date';

function isStreamTournament(t) {
  return t.settings && t.settings.regularity === constants.REGULARITY_STREAM;
}

function isRma(t) {
  return t.settings && t.settings.tag === 'rma';
}

module.exports = {
  isStreamTournament,
  isRegularTournament: (t) => {
    return t.settings && t.settings.regularity === constants.REGULARITY_REGULAR;
  },
  isFreeTournament: (t) => {
    return t.buyIn === 0 && !isStreamTournament(t);
  },
  isNeedsToHoldTournament: (t) => {
    return t.settings && t.settings.hold;
  },
  isRunning: (t) => {
    return t.status === constants.TOURN_STATUS_RUNNING;
  },
  // willRunToday: (t) => {
  //   return t.startDate && isToday(t.startDate);
  // },
  // willRunTomorrow: (t) => {
  //   return t.startDate && isTomorrow(t.startDate);
  // },

  isEliteTournament: (t) => {
    return t.buyIn >= 100;
  },
  isCrowdTournament: (t) => {
    return t.goNext[0] >= 20;
  },
  isRma,
  isRmaRound: (t, i) => {
    return isRma(t) && t.rounds === i;
  },
  isRmaFinal: (t) => {
    return isRma(t) && t.rounds === 4;
  }
};
