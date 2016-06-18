import request from 'superagent';
import Dispatcher from '../dispatcher';
import * as c from '../constants/constants';
import { ProfileType, ModalMessage } from '../components/types';
import store from '../stores/ProfileStore';

type ResponseType = {
  body: {
    profile: ProfileType
  },
};
const sendError = (err, name) => {
  console.error('error happened in ', name, err);
};

export default {
  async initialize() {
    try {
      console.log('async initialize');
      const response: ResponseType = await request.get('/myProfile');
      console.log('async initialize response...', response.body);
      const profile = response.body.profile;
      const { tournaments, money, packs } = profile;

      const tRegs: Array = tournaments;

      const registeredIn = {};
      tRegs.forEach(reg => { registeredIn[reg.tournamentID] = 1; });

      Dispatcher.dispatch({
        type: c.ACTION_INITIALIZE,
        tournaments: registeredIn,
        money,
        packs,
      });
    } catch (err) {
      console.error(err);
    }
  },

  async register(tournamentID) {
    try {
      const response = await request
        .post('RegisterInTournament')
        .send({ login, tournamentID });
      // .end((err, response) => {
      console.log('RegisterInTournament', response);

      // const registeredIn = Object.assign({}, store.getMyTournaments());
      // registeredIn[tournamentID] = 1;

      Dispatcher.dispatch({
        type: c.ACTION_REGISTER_IN_TOURNAMENT,
        // tournaments: registeredIn,
        tournamentID,
      });
    } catch (err) {
      console.error(err);
    }
  },

  async unregister(tournamentID) {
    try {
      const response = await request
        .post('CancelRegister')
        .send({ login, tournamentID });
      // .end((err, response) => {
      console.log('CancelRegister', response);

      const registeredIn = Object.assign({}, store.getMyTournaments());
      registeredIn[tournamentID] = null;

      Dispatcher.dispatch({
        type: c.ACTION_UNREGISTER_FROM_TOURNAMENT,
        tournaments: registeredIn,
        tournamentID,
      });
    } catch (err) {
      console.error(err);
    }
  },
  startTournament(msg) {
    const tournamentID = msg.tournamentID;

    if (!store.isRegisteredIn(tournamentID)) {
      return;
    }

    const audio = new Audio('/sounds/TOURN_START.wav');
    audio.play();

    const { host, port } = msg;
    Dispatcher.dispatch({
      type: c.ACTION_START_TOURNAMENT,
      tournamentID,
      host,
      port,
    });
  },
  async loadNews() {
    request
      .get('/notifications/news')
      .end((err, res: ResponseType) => {
        const news: Array<ModalMessage> = res.body.msg;
        console.log('async loadNews news...', err, res);
        Dispatcher.dispatch({
          type: c.ACTION_LOAD_NEWS,
          news,
        });
      });
  },
  async openPack(value, pay) {
    try {
      const response = await request.post(`openPack/${value}/${pay}`);

      if (response.body.result === 'pay' && response.body.ammount) {
        Dispatcher.dispatch({
          type: c.ACTION_ADD_MESSAGE,
          modal_type: c.MODAL_NO_PACK_MONEY,
          data: {
            ammount: parseInt(response.body.ammount, 10),
          }
        });
      }
    } catch (e) {
      sendError(e, 'openPack');
    }
  },
  testFunction() {
    Dispatcher.dispatch({
      type: c.ACTION_TEST,
    });
  },
};
