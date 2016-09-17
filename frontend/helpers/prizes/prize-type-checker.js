
import constants from '../../constants/constants';

type PrizeType = {
  type: number,
  info: ?any
}

export default {
  isMoneyPrize: (p: PrizeType) => {
    return p.type === constants.PRIZE_TYPE_MONEY;
  },

  isTicketPrize: (p: PrizeType) => {
    return p.type === constants.PRIZE_TYPE_TICKETS;
  },

  isGiftPrize: (p: PrizeType) => {
    return p.type === constants.PRIZE_TYPE_GIFT;
  },

  isPointPrize: (p: PrizeType) => {
    return p.type === constants.PRIZE_TYPE_POINTS;
  },

  isCustomPrize: (p: PrizeType) => {
    return p.type === constants.PRIZE_TYPE_CUSTOM;
  },

  hasNoTypeSpecified: (p: PrizeType) => {
    return !p.type;
  }
};
