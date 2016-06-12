import request from 'superagent';
import Dispatcher from '../dispatcher';
import {
  ACTION_INITIALIZE,
} from '../constants/constants';
import { ProfileType } from '../components/types';
import store from '../stores/Profile';

type ResponseType = {
  body: ProfileType,
};

export default {
  async initialize() {
    try {
      const profile: ResponseType = await request.get('/myProfile');
      const { tournaments, money, packs } = profile.body;

      Dispatcher.register({
        type: ACTION_INITIALIZE,
        tournaments,
        money,
        packs,
      });
    } catch (err) {
      console.error(err);
    }
  }
};
