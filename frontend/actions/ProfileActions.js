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

const sendPaymentStat = (name, ammount, user) => {
  console.log('no money(', name, ammount, user);
};

async function loadChatMessages() {
  try {
    type MsgType = {
      body: {
        msg: {
          senderName: string,
          text: string,
        }
      }
    };
    const response: MsgType = await request.post('/messages/chat/recent');
    // .end((err, res: ResponseType) => {
    const messages = response.body.msg
      .reverse()
      .map(item => {
        return { sender: item.senderName, text: item.text };
      });
    Dispatcher.dispatch({
      type: c.ACTION_SET_MESSAGES,
      messages,
    });
  } catch (e) {
    sendError(e, 'chat/recent');
  }
  // this.setMessages(messages);
  // this.scrollToMessageEnd();
  // });
}

function loadNews() {
  request
    .get('/notifications/news')
    .end((err, res: ResponseType) => {
      const news: Array<ModalMessage> = res.body.msg;
      Dispatcher.dispatch({
        type: c.ACTION_LOAD_NEWS,
        news,
      });
    });
}

async function loadProfile() {
  try {
    console.log('async initialize');
    const response: ResponseType = await request.get('/myProfile');
    // console.log('async initialize response...', response.body);
    const profile = response.body.profile;
    const { tournaments, money, packs } = profile;

    const tRegs: Array = tournaments;

    const registeredIn = {};
    tRegs.forEach(reg => {
      const tID = reg.tournamentID;
      registeredIn[tID] = 1;
    });
    // console.warn('async ACTION_INITIALIZE');
    Dispatcher.dispatch({
      type: c.ACTION_INITIALIZE,
      tournaments: registeredIn,
      money,
      packs,
    });
    Dispatcher.dispatch({
      type: c.CLEAR_TOURNAMENT_DATA,
    });
    tRegs.forEach(reg => {
      const tID = reg.tournamentID;
      request
        .post('/GetTournamentAddress')
        .send({ tournamentID: tID })
        .end((err, res) => {
          if (err) throw err;
          const { host, port, running } = JSON.parse(res.text).address;
          // console.log('/GetTournamentAddress GetTournamentAddress', host, port, running, tID);
          console.log('/GetTournamentAddress running', running, tID);

          // if (running) {
          console.warn('async SET_TOURNAMENT_DATA');
          Dispatcher.dispatch({
            type: c.SET_TOURNAMENT_DATA,
            host,
            port,
            running: running ? 1 : 0,
            tournamentID: tID,
          });
          // }
        });
    });
  } catch (err) {
    console.error(err);
  }
}

function initialize() {
  loadProfile();
  loadChatMessages();
  loadNews();
}

function update() {
  loadProfile();
  loadNews();
}

export default {
  initialize,
  update,

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

  finishTournament(msg) {
    const { tournamentID } = msg;
    console.warn('finish', msg);
    if (!store.isRegisteredIn(tournamentID)) {
      return;
    }

    const audio = new Audio('/sounds/TOURN_START.wav');
    audio.play();

    Dispatcher.dispatch({
      type: c.ACTION_FINISH_TOURNAMENT,
      tournamentID,
    });
  },

  loadNews,

  async openPack(value, pay) {
    try {
      // console.log('async openPack', value, pay);
      const response = await request.post(`openPack/${value}/${pay}`);
      if (response.body.err) throw response.body.err;
      // console.log('async openPack', response.body.err);

      if (response.body.result === 'pay' && response.body.ammount) {
        Dispatcher.dispatch({
          type: c.ACTION_ADD_MESSAGE,
          modal_type: c.MODAL_NO_PACK_MONEY,
          data: {
            ammount: parseInt(response.body.ammount, 10),
          }
        });
      } else {
        this.loadNews();
      }
    } catch (e) {
      sendError(e, 'openPack');
    }
  },

  loadChatMessages,
  addNotification(data, modalType) {

    Dispatcher.dispatch({
      type: c.ACTION_ADD_NOTIFICATION,
      data,
      modalType,
    });
  },
  payModalStat() {

  },
  appendChatMessage(data) {
    Dispatcher.dispatch({
      type: c.ACTION_ADD_CHAT_MESSAGE,
      data,
    });
  },
  sendMessage(text, sender) {
    socket.emit('chat message', { text, sender });
  },
  testFunction() {
    Dispatcher.dispatch({
      type: c.ACTION_TEST,
    });
  },
};
