import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher';
import { TournamentType, ProfileInfo } from '../components/types';
import {
  ACTION_INITIALIZE,
  ACTION_REGISTER_IN_TOURNAMENT,
  ACTION_UNREGISTER_FROM_TOURNAMENT,
} from '../constants/constants';

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

  isRegisteredIn(id) {
    console.log('currently', _tournaments, _money, _packs, id);
    return _tournaments[id];
  }

  register(id) {
    // _regs[id] = 1;
    _tournaments[id] = 1;
  }

  unregister(id) {
    // _regs[id] = null;
    _tournaments[id] = null;
  }
}

const store = new ProfileStore();

type PayloadType = {
  status: number,
  online: number,

  tournaments: Object,
  money: number,
  packs: Object,

  tournamentID: number,
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
    case ACTION_REGISTER_IN_TOURNAMENT:
      console.log(ACTION_REGISTER_IN_TOURNAMENT, p.tournamentID, _tournaments);
      // _tournaments = p.tournaments;
      _tournaments[p.tournamentID] = 1;
      // let object = {};
      // object[p.tournamentID] = 1;
      // _tournaments = Object.assign(object, store.getMyTournaments());
      // registeredIn[tournamentID] = 1;// _tournaments = p.tournaments;
      store.emitChange();
      break;
    case ACTION_UNREGISTER_FROM_TOURNAMENT:
      _tournaments = p.tournaments;
      store.emitChange();
      break;
    default:
      console.warn(`Dispatcher.register unexpected type ${p.type}`);
      break;
  }
});

export default store;
