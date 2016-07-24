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

type MsgType = {
  body: {
    msg: {
      senderName: string,
      text: string,
    }
  }
};

const sendError = (err, name) => {
  console.error('error happened in ', name, err);
};

const sendPaymentStat = (name, ammount, user) => {
  console.log('no money(', name, ammount, user);
};

async function loadChatMessages() {
  try {
    const response: MsgType = await request
      .post('/messages/chat/recent');

    const messages = response.body.msg
      .reverse()
      .map(item => {
        return { sender: item.senderName, text: item.text };
      });

    Dispatcher.dispatch({
      type: c.ACTION_SET_MESSAGES,
      messages
    });
  } catch (e) {
    sendError(e, 'chat/recent');
  }
}

async function loadSupportMessages() {
  if (!login) {
    return;
  }

  try {
    const response: MsgType = await request.get('/messages/support');

    const messages = response.body.msg
      .reverse()
      .map(item => {
        return { sender: item.senderName, text: item.text };
      });
    console.log('messages sup', messages);
    Dispatcher.dispatch({
      type: c.ACTION_SET_SUPPORT_MESSAGES,
      messages
    });
  } catch (e) {
    sendError(e, 'messages/support');
  }
}

function loadNews() {
  if (!login) {
    return;
  }

  request
    .get('/notifications/news')
    .end((err, res: ResponseType) => {
      const news: Array<ModalMessage> = res.body.msg;
      Dispatcher.dispatch({
        type: c.ACTION_LOAD_NEWS,
        news
      });
    });
}

function addNotification(data, modalType) {
  Dispatcher.dispatch({
    type: c.ACTION_ADD_NOTIFICATION,
    data,
    modalType
  });
}

async function loadProfile() {
  try {
    if (!login) {
      return;
    }

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
      packs
    });

    Dispatcher.dispatch({
      type: c.CLEAR_TOURNAMENT_DATA
    });

    tRegs.forEach(reg => {
      const tournamentID = reg.tournamentID;
      request
        .post('/GetTournamentAddress')
        .send({ tournamentID })
        .end((err, res) => {
          if (err) throw err;
          const { host, port, running } = JSON.parse(res.text).address;
          // console.log('/GetTournamentAddress GetTournamentAddress', host, port, running, tID);

          // console.warn('async SET_TOURNAMENT_DATA');
          Dispatcher.dispatch({
            type: c.SET_TOURNAMENT_DATA,
            host,
            port,
            running: running ? 1 : 0,
            tournamentID
          });
        });
    });
  } catch (e) {
    sendError(e, 'loadProfile');
  }
}

function initialize() {
  loadProfile();
  loadChatMessages();
  loadNews();
}

function update() {
  // console.log('actions.update');
  loadProfile();
  loadNews();
}

export default {
  initialize,
  update,
  report(err, where) {
    request
      .post('/mark/clientError')
      .send({ err, where });
  },
  async register(tournamentID, buyIn) {
    try {
      const response = await request.post('RegisterInTournament').send({ login, tournamentID });
      const result = response.body.result;

      const registeredIn = Object.assign({}, store.getMyTournaments());

      registeredIn[tournamentID] = 1;

      if (result === 'OK') {
        Dispatcher.dispatch({
          type: c.ACTION_REGISTER_IN_TOURNAMENT,
          tournaments: registeredIn,
          tournamentID
        });
      }

      if (result === c.TREG_NO_MONEY) {
        addNotification({ ammount: buyIn }, c.MODAL_NO_TOURNAMENT_MONEY);
      }

    } catch (err) {
      console.error(err);
    }
  },

  async unregister(tournamentID) {
    try {
      const response = await request
        .post('CancelRegister')
        .send({ login, tournamentID });

      const registeredIn = Object.assign({}, store.getMyTournaments());
      registeredIn[tournamentID] = null;

      Dispatcher.dispatch({
        type: c.ACTION_UNREGISTER_FROM_TOURNAMENT,
        tournaments: registeredIn,
        tournamentID
      });

      update();
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
      port
    });
  },

  finishTournament(msg) {
    const { tournamentID } = msg;
    if (!store.isRegisteredIn(tournamentID)) {
      return;
    }

    const audio = new Audio('/sounds/TOURN_START.wav');
    audio.play();

    Dispatcher.dispatch({
      type: c.ACTION_FINISH_TOURNAMENT,
      tournamentID
    });
  },

  loadNews,

  support(text) {
    socket.emit('support', { text, login });
    loadSupportMessages();
  },

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
            ammount: parseInt(response.body.ammount, 10)
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
  loadSupportMessages,
  addNotification,
  payModalStat() {},
  updateTournaments(tournaments) {
    Dispatcher.dispatch({
      type: c.UPDATE_TOURNAMENTS,
      tournaments
    });
  },
  appendChatMessage(data) {
    Dispatcher.dispatch({
      type: c.ACTION_ADD_CHAT_MESSAGE,
      data
    });
  },
  sendMessage(text, sender) {
    socket.emit('chat message', { text, sender });
  },
  testFunction() {
    Dispatcher.dispatch({
      type: c.ACTION_TEST
    });
  }
};
