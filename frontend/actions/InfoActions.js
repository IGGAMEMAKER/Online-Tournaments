import request from 'superagent';
import Dispatcher from '../dispatcher';
import * as c from '../constants/constants';
import store from '../stores/AdminStore';

import sendError from '../helpers/sendError';

// const update = () => {
//
// };

async function getGifts() {
  try {
    const response = await request.get('/api/gifts/');

    const gifts = response.body.msg;
    // console.log('got response', gifts);

    Dispatcher.dispatch({
      type: c.GET_GIFTS,
      gifts
    })

  } catch (e) {
    sendError(e, 'admin/getGifts');
  }
}

async function getAvailablePacks() {
  try {
    const response = await request.get('/api/packs/available');
    // const response = await request.get('/api/packs/all');

    const packs = response.body.msg;
    Dispatcher.dispatch({
      type: c.GET_PACKS,
      packs
    })

  } catch (e) {
    sendError(e, 'admin/getPacks');
  }
}

export default {
  getGifts,
  getAvailablePacks,
}