import constants from '../constants/constants';
import { TournamentType } from '../components/types';
import { isToday, isTomorrow } from './date';

function isStreamTournament(t: TournamentType) {
  return t.settings && t.settings.regularity === constants.REGULARITY_STREAM;
}

function isRma(t: TournamentType) {
  return t.settings && t.settings.tag === 'rma';
}

export default {
  isStreamTournament,
  isRegularTournament: (t: TournamentType) => {
    return t.settings && t.settings.regularity === constants.REGULARITY_REGULAR;
  },
  isFreeTournament: (t: TournamentType) => {
    return t.buyIn === 0 && !isStreamTournament(t);
  },
  willRunToday: (t: TournamentType) => {
    return t.startDate && isToday(t.startDate);
  },
  willRunTomorrow: (t: TournamentType) => {
    return t.startDate && isTomorrow(t.startDate);
  },

  isEliteTournament: (t: TournamentType) => {
    return t.buyIn >= 100;
  },
  isCrowdTournament: (t: TournamentType) => {
    return t.goNext[0] >= 20;
  },
  isRma,
  isRmaRound: (t: TournamentType, i) => {
    return isRma(t) && t.rounds === i;
  },
  isRmaFinal: (t: TournamentType) => {
    return isRma(t) && t.rounds === 4;
  }
}
