import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher';
import * as c from '../constants/constants';
import * as t from '../components/types';

// let _tournaments: Array<TournamentType> = [];
let _tournaments: Object = {};
let _adresses: Object = {};
let _running: Object = {};

let _money: number = 0;
let _packs: Object = {};
let _loaded: Boolean = false;

let _news: Array = [];
let _chatMessages: Array = [];

let _testValue = 0;

const EC = 'EVENT_CHANGE';
class ProfileStore extends EventEmitter {
  addChangeListener(cb: Function) {
    this.addListener(EC, cb);
  }

  removeChangeListener(cb: Function) {
    this.removeListener(EC, cb);
  }

  emitChange() {
    this.emit(EC);
  }

  getMyTournaments() {
    return _tournaments;
  }

  getRunningTournaments() {
    // return _running;
    // console.log('getRunningTournaments', _running);
    console.log('getRunningTournaments', Object.keys(_running));
    const arr = Object.keys(_running)
      .filter(obj => _running[obj] === 1)
      .map((obj) => parseInt(obj, 10));
    return arr;
  }

  hasRunningTournaments() {
    return Object.keys(_running).filter(obj => obj === 1);
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

  getTestValue() {
    return _testValue;
  }

  getAdress(id) {
    return _adresses[id];
  }

  getGameUrl(id) {
    return `http://${_adresses[id].host}:${_adresses[id].port}/Game`;
  }

  getMyNews() {
    return _news;
  }

  hasNews() {
    return _news.length;
  }

  getChatMessages() {
    return _chatMessages;
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

  news: Array<t.ModalMessage>,
  messages: Array,
};

Dispatcher.register((p: PayloadType) => {
  // console.log(p.type, p);
  let change = true;
  switch (p.type) {
    case c.ACTION_INITIALIZE:
      console.log('initialize', p.type, p);
      _loaded = true;
      _tournaments = p.tournaments;
      _money = p.money;
      _packs = p.packs;
      break;
    case c.ACTION_REGISTER_IN_TOURNAMENT:
      _tournaments[p.tournamentID] = 1;
      break;
    case c.ACTION_UNREGISTER_FROM_TOURNAMENT:
      _tournaments = p.tournaments;
      break;
    case c.ACTION_START_TOURNAMENT:
      _running[p.tournamentID] = 1;
      _adresses[p.tournamentID] = { port: p.port, host: p.host };
      break;
    case c.ACTION_FINISH_TOURNAMENT:
      _running[p.tournamentID] = 0;
      break;
    case c.ACTION_ADD_MESSAGE:
      _news.splice(0, 0, {
        data: p.data,
        type: p.modal_type,
        _id: 0,
      });
      break;
    case c.ACTION_ADD_CHAT_MESSAGE:
      _chatMessages.push({
        sender: p.data.sender,
        text: p.data.text,
        _id: 0,
      });
      break;
    case c.ACTION_SET_MESSAGES:
      _chatMessages = p.messages;
      break;
    case c.ACTION_LOAD_NEWS:
      console.log('load my news', p.news);
      _news = p.news;
      break;
    case c.SET_TOURNAMENT_DATA:
      _adresses[p.tournamentID] = {
        host: p.host,
        port: p.port,
      };
      _running[p.tournamentID] = p.running;
      break;

    case c.ACTION_TEST:
      console.warn('_testValue', _testValue);
      break;
    default:
      change = false;
      console.warn(`Dispatcher.register unexpected type ${p.type}`);
      break;
  }
  if (change) store.emitChange();
});

export default store;
