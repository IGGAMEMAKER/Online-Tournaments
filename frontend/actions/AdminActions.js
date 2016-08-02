import request from 'superagent';
import Dispatcher from '../dispatcher';
import * as c from '../constants/AdminConstants';
import store from '../stores/AdminStore';

import sendError from '../helpers/sendError';

// const update = () => {
//
// };

async function getGifts() {
  try {
    const response = await request.get('/api/gifts/');

    const gifts = response.body.msg;
    console.log('got response', gifts);

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

    const packs = response.body.msg;
    // console.log('')
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
  async removeGift(id) {
    try {
      const response = await request.post(`/api/gifts/remove/${id}`);

      getGifts();
    } catch (e) {
      sendError(e, 'admin/getPacks');
    }
  },
  async addGift(gift) {
    try {
      console.log('sended gift...', gift);

      const response = await request
        .post('/api/gifts/add')
        .send(gift);

      const result = response.body.msg;
      const succeeded = result.name;

      if (succeeded) {
        console.log('adding successfull', result);
        getGifts();
      } else {
        console.error('adding failed', result);
      }

    } catch (e) {
      sendError(e, 'admin/addGift');
    }
  },
  async editGift(gift) {
    try {
      await request.post(`/api/gifts/edit/${gift._id}`).send(gift);

      getGifts();
    } catch (e) {
      sendError('admin/editGift', e);
    }
  },
  async editPack(pack) {
    try {
      console.log('new version of pack', pack);
      const response = await request.post(`/api/packs/edit/${pack.packID}`).send(pack);
      console.log('editPack actions response', response);

      getAvailablePacks();
    } catch (e) {
      sendError('admin/editPack', e);
    }
  }
}