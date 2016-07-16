import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher';
import * as c from '../constants/constants';
import * as t from '../components/types';

// let _tournaments: Array<TournamentType> = [];
let _tournaments: Object = {}; // tournaments, where the player is registered
let _adresses: Object = {}; // adresses of tournaments
let _running: Object = {};

let _availableTournaments = [];

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

  getMyTournamentList() {
    return Object.keys(_tournaments);
  }

  getRunningTournaments() {
    // return _running;
    // console.log('getRunningTournaments', _running);
    // console.log('getRunningTournaments', Object.keys(_running));
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
    // console.log('currently', _tournaments, _money, _packs, id);
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
    // var addr = `http://${host}:${port}/Game?tournamentID=${tournamentID}`;
    return `http://${_adresses[id].host}:${_adresses[id].port}/Game?tournamentID=${id}`;
    // return `http://localhost:5010/Game?tournamentID=${id}`;
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

  getAvailableTournaments() {
    return _availableTournaments;
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

const delayedUpdate = (s) => {
  // const time = 1000;
  // setTimeout(() => { s.emitChange(); }, time);
};

Dispatcher.register((p: PayloadType) => {
  // console.error(p.type);//, p);
  let change = true;
  switch (p.type) {
    case c.ACTION_INITIALIZE:
      // console.log('initialize', p.type, p);
      _loaded = true;
      _tournaments = p.tournaments;
      _money = p.money;
      _packs = p.packs;
      break;
    case c.UPDATE_TOURNAMENTS:
      _availableTournaments = p.tournaments;
      break;
    case c.ACTION_REGISTER_IN_TOURNAMENT:
      _tournaments[p.tournamentID] = 1;
      break;
    case c.ACTION_UNREGISTER_FROM_TOURNAMENT:
      _tournaments = p.tournaments;
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
      // console.log('load my news', p.news);
      _news = p.news;
      break;

    case c.ACTION_START_TOURNAMENT:
      _running[p.tournamentID] = 1;
      _adresses[p.tournamentID] = { port: p.port, host: p.host };
      delayedUpdate(store);
      break;
    case c.ACTION_FINISH_TOURNAMENT:
      _running[p.tournamentID] = 0;
      delayedUpdate(store);
      break;
    case c.SET_TOURNAMENT_DATA:
      console.warn('running is....', p.running, p.tournamentID);
      _running[p.tournamentID] = p.running === true || p.running === 1 ? 1 : 0;
      // _running[p.tournamentID] = 1;
      _adresses[p.tournamentID] = { port: p.port, host: p.host };
      delayedUpdate(store);
      break;
    case c.CLEAR_TOURNAMENT_DATA:
      _running = {};
      _adresses = {};
      break;
    case c.ACTION_ADD_NOTIFICATION:
      _news.splice(0, 0, {
        data: p.data,
        type: p.modalType,
        _id: 0,
      });
      break;
    case c.ACTION_TEST:
      console.warn('_testValue', _testValue);
      _testValue++;
      break;
    default:
      change = false;
      console.warn(`Dispatcher.register unexpected type ${p.type}`);
      break;
  }
  if (change) store.emitChange();
  // setInterval(() => {
  //   store.emitChange();
  // }, 3000);
});

export default store;
