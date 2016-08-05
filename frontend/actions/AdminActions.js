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
    // const response = await request.get('/api/packs/available');
    const response = await request.get('/api/packs/all');

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
  async removeGift(id) {
    try {
      const response = await request.post(`/api/gifts/remove/${id}`);

      getGifts();
    } catch (e) {
      sendError(e, 'admin/removeGift');
    }
  },
  async removePack(id) {
    try {
      const response = await request.post(`/api/packs/remove/${id}`);

      getAvailablePacks();
    } catch (e) {
      sendError(e, 'admin/removePack');
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
      // console.log('sending newer gift', gift);
      const response = await request.post(`/api/gifts/edit/${gift._id}`).send(gift);
      // console.log('editGift response', response);

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