import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher';
import * as c from '../constants/AdminConstants';
import * as t from '../components/types';

const EC = 'ADMIN_EVENT_CHANGE';

let _gifts = [];
let _packs = [];
let _tournaments = [];

class AdminStore extends EventEmitter {
  addChangeListener(cb:Function) {
    this.addListener(EC, cb);
  }

  removeChangeListener(cb:Function) {
    this.removeListener(EC, cb);
  }

  emitChange() {
    this.emit(EC);
  }

  getGifts() {
    return _gifts;
  }

  getPacks() {
    return _packs;
  }

  getTournaments() {
    return _tournaments;
  }

  getGiftByGiftID(giftID) {
    let gift = null;

    _gifts.forEach((g) => {
      if (g._id === giftID) {
        gift = g;
      }
    });

    if (gift) {
      return Object.assign({}, gift);
    } else {
      return null;
    }
  }

  getGiftIndexByGiftID(giftID) {
    let index = -1;

    _gifts.forEach((g, i) => {
      if (g._id === giftID) {
        index = i;
      }
    });

    return index;
  }
}

const store = new AdminStore();

type PayloadType = {
  status: number,
  online: number,

  tournaments: Array,
  money: number,
  packs: Object,

  tournamentID: number,

  news: Array<t.ModalMessage>,
  messages: Array,

  type: string,
};

Dispatcher.register((p: PayloadType) => {
  if (!p.type) {
    console.error('empty type prop in payload. admin', p);
    return;
  }

  let change = true;
  switch (p.type) {
    case c.GET_GIFTS:
      // console.log('store admin', p);
      _gifts = p.gifts;
      break;
    case c.GET_PACKS:
      // console.log('store admin get packs', p);
      _packs = p.packs;
      break;
    case c.GET_TOURNAMENTS:
      _tournaments = p.tournaments;
      break;
    default:
      break;
  }

  if (change) store.emitChange();
});

export default store;
