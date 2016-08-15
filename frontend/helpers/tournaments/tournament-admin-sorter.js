import { TournamentType } from '../../components/types';

export default function (sortBy, order) {
  let v1;
  let v2;
  let sort;
  switch (sortBy) {
    case 'settings.regularity':
      sort = (t1: TournamentType, t2: TournamentType) => {
        v1 = t1.settings.regularity || 0;
        v2 = t2.settings.regularity || 0;
        return (v2 - v1) * order;
      };
      break;
    case 'startDate':
      sort = (t1: TournamentType, t2: TournamentType) => {
        v1 = Date.parse(t1.startDate) || 0;
        v2 = Date.parse(t2.startDate) || 0;
        // v2 = t2.startDate;
        return (v2 - v1) * order;
      };
      break;
    default:
      sort = (t1: TournamentType, t2: TournamentType) => {
        v1 = t1[sortBy] || 0;
        v2 = t2[sortBy] || 0;
        return (v2 - v1) * order;
      };
      break;
  }
  return sort;
}