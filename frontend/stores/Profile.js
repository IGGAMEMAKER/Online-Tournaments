import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher';
import { TournamentType, ProfileInfo } from '../components/types';
import { ACTION_INITIALIZE } from '../constants/constants';

// let _tournaments: Array<TournamentType> = [];
let _tournaments: Object = {};
let _money: number = 100;
let _packs: Object = {};
let _loaded: Boolean = false;

const EC = 'EVENT_CHANGE';
class ProfileStore extends EventEmitter {
  addChangeListener(c: Function) {
    this.addListener(EC, c);
  }

  removeChangeListener(c: Function) {
    this.removeListener(EC, c);
  }

  emitChange() {
    this.emit(EC);
  }

  getMyTournaments() {
    return _tournaments;
  }

  getMoney() {
    return _money;
  }

  getMyPacks() {
    return _packs;
  }

  isLoaded() {
    return _loaded;
  }
}

const store = new ProfileStore();

type PayloadType = {
  status: number,
  online: number,

  tournaments: Array<TournamentType>,
  money: number,
  packs: Object,
};

Dispatcher.register((p: PayloadType) => {
  switch (p.type) {
    case ACTION_INITIALIZE:
      _loaded = true;
      _tournaments = p.tournaments;
      _money = p.money;
      _packs = p.packs;
      store.emitChange();
      break;

    default:
      console.warn(`Dispatcher.register unexpected type ${p.type}`);
      break;
  }
});

export default store;
