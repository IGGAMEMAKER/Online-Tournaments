import request from 'superagent';
import Dispatcher from '../dispatcher';
import {
  ACTION_INITIALIZE,
  ACTION_REGISTER_IN_TOURNAMENT,
  ACTION_UNREGISTER_FROM_TOURNAMENT,
  ACTION_TEST,
} from '../constants/constants';
import * as c from '../constants/constants';
import { ProfileType } from '../components/types';
import store from '../stores/Profile';

type ResponseType = {
  body: {
    profile: ProfileType
  },
};

export default {
  async initialize() {
    try {
      console.log('async initialize');
      const response: ResponseType = await request.get('/myProfile');
      console.log('async initialize response...', response);
      const profile = response.body.profile;
      const { tournaments, money, packs } = profile;

      const tRegs: Array = tournaments;

      const registeredIn = {};
      tRegs.forEach(reg => { registeredIn[reg.tournamentID] = 1; });

      Dispatcher.dispatch({
        type: ACTION_INITIALIZE,
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
        type: ACTION_REGISTER_IN_TOURNAMENT,
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
        type: ACTION_UNREGISTER_FROM_TOURNAMENT,
        tournaments: registeredIn,
        tournamentID,
      });
    } catch (err) {
      console.error(err);
    }
  },
  testFunction() {
    Dispatcher.dispatch({
      type: c.ACTION_TEST,
    });
  },
};
