import { h, Component } from 'preact';
import { ModalMessage } from '../types';
import request from 'superagent';

import * as c from '../../constants/constants';
// import io from 'socket.io-client';
// import store from '../../stores/Profile';

type PropsType = {
  store: Object,
}

type StateType = {
  visible: boolean,
  messages: Array<ModalMessage>,
  runningTournaments: false,
}

type ResponseType = {
  body: {
    msg: Array<ModalMessage>,
  }
}

export default class Modal extends Component {
  state = {
    visible: false,

    tournaments: {},
    registeredIn: {},
  };

  componentWillMount() {
    this.loadNews();
    console.log('componentWillMount modal');
    socketNews.on('activity', (msg) => {
      console.log('azaza in modal');
      console.log('socketNews', msg);
    });

    socketNews.on('newsUpdate', (msg) => {
      if (msg && msg.msg === login) {
        this.loadNews();
      }
    });

    socketNews.on('StartTournament', (msg) => {
      console.log('StartTournament in socketNews', msg);
      const tournamentID = msg.tournamentID;
      // alert('start!');
      // if (userIsRegisteredIn(tournamentID)) {
      console.log('props', this.props.store);
      if (this.props.store.isRegisteredIn(tournamentID)) {
        // window.scrollTo(0,0);

        const audio = new Audio('/sounds/TOURN_START.wav');
        audio.play();
        this.setState({ runningTournaments: true });
      }

      const { host, port, running } = msg;
      curLogins = msg.logins;
    });
  }

  skip = (text: string, id) => {
    console.log('skip', text, id);
  };

  sendError = err => {
    console.log('sendError in modal', err);
  };

  markAsRead = id => {
    // mark('/message/shown', { id : messageID })
    request
      .post('/message/shown')
      .send({ id })
      .end((err, res) => {
        console.log(err, res, 'message/shown');
      });
  };

  modal_pic = (name) => {
    return <div><br /><img alt="" width="100%" src={`/img/${name}`} /></div>;
  };

  hide = () => {
    this.setState({ visibility: false });
  };

  winningPicture = () => {
    return this.modal_pic('win_1.png');
  };

  ratingPicture = () => {
    return this.modal_pic('win_2.jpg');
  };

  losePicture = () => {
    return this.modal_pic('lose_1.jpg');
  };

  answer = (code, messageID) => {
    request
      .get(`message/action/${code}/${messageID}`);
    this.hide();
  };

  buttons = {
    action: (code, messageID, style) => {
      return <a className="btn btn-primary" onClick={this.answer(code, messageID)}>{style.text}</a>;
    },
  };

  getModalData = (message, info, messageID) => {
    let header = '';
    let body = '';
    let footer = '';

    const main = (m) => (<h3>{m}</h3>);
    switch (message.type) {
      case c.NOTIFICATION_GIVE_MONEY:
        header = 'Деньги, деньги, деньги!';
        body = `Вы получаете ${info.ammount}руб на счёт!`;
        footer = this.skip('Спасибо!', messageID);
        break;
      case c.NOTIFICATION_ACCEPT_MONEY:
        header = 'Бонус!';
        body = `Примите ${info.ammount}рублей на счёт!`;

        // footer = news.buttons.action(0, messageID, { text: 'Спасибо!' });
        footer = this.buttons.action(0, messageID, { text: 'Спасибо!' });
        break;
      case c.NOTIFICATION_FORCE_PLAYING:
        // body = 'Настало время играть!';
        // footer = fast_register_button();
        break;
      case c.NOTIFICATION_CUSTOM:
        header = info.header;
        body = info.text;

        if (info.imageUrl) {
          body += this.modal_pic(info.imageUrl);
        }

        footer = this.skip('Хорошо', messageID);
        break;
      case c.NOTIFICATION_AUTOREG:
        break;
      case c.NOTIFICATION_FIRST_MESSAGE:
        var mainPrize = info.mainPrize;
        console.log(mainPrize);

        header = 'С почином!';
        // 'Проверь свои знания, участвуй в турнирах, и выигрывай ценные призы!'

        body = 'Вы сыграли в первом турнире<br><br>';
        body += 'Продолжайте играть и выигрывайте призы благодаря своим знаниям!';
        footer = this.skip('ОК', messageID);
        break;
      case c.NOTIFICATION_WIN_MONEY:
        // {
        //   tournamentID : data.tournamentID,
        //   winners:winners,
        //   count:winnerCount,
        //   prizes:prizes
        // }
        let txt = main(`Вы выиграли ${info.prizes[0]}РУБ !! Так держать!`);
        header = `Вы победили в турнире #${info.tournamentID}`;

        body = txt + this.winningPicture();

        footer = this.skip('Урра!', messageID);
        break;
      case c.NOTIFICATION_LOSE_TOURNAMENT:
        header = `Турнир #${info.tournamentID} завершён`;
        body = main('Эх, не повезло( <br>В следующий раз точно получится!') + this.losePicture();

        footer = this.skip('Продолжить', messageID);
        break;
      case c.NOTIFICATION_CARD_GIVEN:
        header = 'Вы получаете карточку!';
        const card = info;
        console.log(card);
        body = (
          <div>
            <p className="card-name">
              Собирайте
              <a href="/Packs">карточки</a>
              и получайте денежные призы!
            </p>
            <p className="card-name">{card.description}</p>
            {drawCard(card)}
          </div>
        );

        const close = <button className="btn btn-default" onClick={this.hide}> Закрыть </button>;
        const value = info.value || c.CARD_COLOUR_GRAY;
        let btn = <a className="btn btn-primary" href="/Packs"> Подробнее </a>;
        const packOpener = () => openPack(value, 1);

        if (!card.isFree) {
          btn = <button className="btn btn-primary" onClick={packOpener}>Открыть ещё!</button>;
        }

        footer = <div>{btn}{close}</div>;
        break;
      case c.NOTIFICATION_GIVE_PACK:
        header = `Вы получаете паки: ${info.count}x`;
        body = drawPackButton(info.colour);
        footer = this.skip('Урра!', messageID);
        break;
      default:
        break;
    }
    return { header, body, footer };
  };

  loadNews = () => {
    request
      .get('/notifications/news')
      .end((err, res: ResponseType) => {
        const messages: Array<ModalMessage> = res.body.msg;
        console.log('loadNews news...', err, res);
        this.setState({ messages, visible: !!messages.length });
      });
  };

  render(props: PropsType, state: StateType) {
    let header = '';
    let body = '';
    let footer = '';

    let title = '';

    if (state.runningTournaments) {
      console.log('state.runningTournament', 'mooooooooooodaaaaaaaaal');
      setTimeout(() => {
        console.log('timeout');
        $("#play-button-modal").modal('show');
      }, 1500);
      return (
        <div>
          <div id="play-button-modal" className="modal fade" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal"> &times;</button>
                  <h4 className="modal-title"> Турниры начинаются! </h4>
                </div>
                <div className="modal-body" id="cBody">{props.store.getMyTournaments()}</div>
                <div className="modal-footer" id="cFooter">{`footer ${state.runningTournaments}`}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    try {
      const messages = state.messages;
      const count = messages.length;

      if (count > 0) {
        const message = messages[0];
        const info = message.data || {};
        const messageID = message["_id"];

        header = this.getModalData(message, info, messageID);
        title = header;
        if (count > 1) title += ` (${count})`;

        // mark('/message/shown', { id : messageID })
        this.markAsRead(messageID);
        // getProfile();
      }
    } catch (err) {
      this.sendError(err, 'drawNewsModal');
    }

    const style = {};
    if (!state.visible) {
      style.display = 'none';
    }

    return (
      <div style={style}>
        <div className="modal fade" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal"> &times;</button>
                <h4 className="modal-title"> {title} </h4>
              </div>
              <div className="modal-body" id="cBody">{body}</div>
              <div className="modal-footer" id="cFooter">{footer}</div>
            </div>
          </div>
        </div>
      </div>
    );

    // return (
    //   <div>
    //     <button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#myModal">Open Modal</button>
    //     <div id="myModal" class="modal fade" role="dialog">
    //       <div class="modal-dialog">
    //         <div class="modal-content">
    //           <div class="modal-header">
    //             <button type="button" class="close" data-dismiss="modal">&times;</button>
    //             <h4 class="modal-title">Modal Header</h4>
    //           </div>
    //           <div class="modal-body">
    //             <p>Some text in the modal.</p>
    //           </div>
    //           <div class="modal-footer">
    //             <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // );
  }
}
