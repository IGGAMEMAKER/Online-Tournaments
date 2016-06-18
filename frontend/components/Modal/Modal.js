import { h, Component } from 'preact';
import { ModalMessage } from '../types';
import request from 'superagent';

import * as c from '../../constants/constants';
// import io from 'socket.io-client';
import store from '../../stores/ProfileStore';
import actions from '../../actions/ProfileActions';
import PackCard from '../Packs/PackCard';

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

type TournamentStartType = {
  tournamentID: number,
  gameName: number,
}

export default class Modal extends Component {
  state = {
    visible: false,

    tournaments: {},
    registeredIn: {},
    messages: [],
  };

  componentWillMount() {
    store.addChangeListener(() => {
      this.setState({
        messages: store.getMyNews(),
        visible: store.hasNews(),
        runningTournaments: store.hasRunning(),
      });
    });
    actions.loadNews();
  }

  skip = (text: string, id) => {
    console.log('skip', text, id);
  };

  sendError = (err, name) => {
    console.log('sendError in modal', name, err);
  };

  markAsRead = id => {
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
    // $("#modal-standard").modal('hide');
    this.setState({ visible: false });
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
    console.log('getModalData');
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
        // console.error('notification card given');
        header = 'Вы получаете карточку!';
        const card = info;
        console.log(card);
        body = (
          <div>
            <p className="card-title">
              Собирайте карточки
              и получайте денежные призы!
            </p>
            <p className="card-title">
              {card.description}
            </p>
            <PackCard
              src={`/img/topics/realmadrid/${card.photoURL}`}
              description={card.description}
              color={card.colour}
            />
          </div>
        );

        const close = <button className="btn btn-default" onClick={this.hide}> Закрыть </button>;
        const value = info.value || c.CARD_COLOUR_GRAY;
        let btn = <a className="btn btn-primary" href="/Packs"> Подробнее </a>;

        if (!card.isFree) {
          btn = (
            <button
              className="btn btn-primary"
              onClick={() => { actions.openPack(value, 1); }}
            >Открыть ещё!</button>
          );
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

  drawPlayButton = (host, port, tournamentID) => {
    var addr = `http://${host}:${port}/Game?tournamentID=${tournamentID}`;
    return (
      <form id="form1" method="post" action={addr}>
        <input type="hidden" name="login" value="'+login+'" />
        <input
          type="submit"
          className="btn btn-primary btn-lg"
          value={`Сыграть в турнир #${tournamentID}`}
        />
      </form>
    );
  };

  drawPlayButtons = (tournaments: Array<TournamentStartType>) => {
    return tournaments.map((t) => {
      const host = 'localhost';
      const port = '5010';

      return this.drawPlayButton(host, port, t.tournamentID);
    });
  };

  show = () => {
    console.log('show');
    setTimeout(() => {
      $("#modal-standard").modal('show');
    }, 300);
  };

  modal = (id, status) => {
    $(id).modal(status ? 'show' : 'hide');
    // {$("#modal-standard").modal(state.visible ? 'show' : 'hide')}
  };

  playModal = (status) => {
    this.modal('#modal-standard', status);
  };

  // loadNews = () => {
  //   request
  //     .get('/notifications/news')
  //     .end((err, res: ResponseType) => {
  //       const messages: Array<ModalMessage> = res.body.msg;
  //       console.log('loadNews news...', err, res);
  //       this.setState({ messages, visible: !!messages.length });
  //     });
  // };

  render(props: PropsType, state: StateType) {
    let header = '';
    let body = '';
    let footer = '';

    let title = '';

    if (state.runningTournaments) {
      console.log('state.runningTournament', 'mooooooooooodaaaaaaaaal');
      setTimeout(() => {
        console.log('timeout');
        const list = props.store.getMyTournaments();
        console.log('tournaments now...', list);
        $("#play-button-modal").modal('show');
      }, 1500);
      const list: Object = props.store.getMyTournaments();

      console.log('tournaments now...', list);
      return (
        <div>
          <div id="play-button-modal" className="modal fade" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal"> &times;</button>
                  <h4 className="modal-title"> Турниры начинаются! </h4>
                </div>
                <div className="modal-body" id="cBody">{Object.keys(list)}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    console.log('no runnings', state.messages);
    try {
      const messages = state.messages;
      const count = messages.length;

      if (count > 0) {
        const message = messages[0];
        const data = message.data || {};
        const messageID = message["_id"] || 0;

        const modalData = this.getModalData(message, data, messageID);
        header = modalData.header;
        body = modalData.body;
        footer = modalData.footer;

        title = header;
        if (count > 1) title += ` (${count})`;

        // mark('/message/shown', { id : messageID })
        this.markAsRead(messageID);
        // this.show();
      } else {
        console.warn('no messages');
      }
    } catch (err) {
      this.sendError(err, 'drawNewsModal');
    }

    return (
      <div id="modal-standard" className="modal fade" role="dialog">
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
        {$("#modal-standard").modal(state.visible ? 'show' : 'hide')}
      </div>
    );

    // return (
    //   <div>
    //     <button
    //       type="button"
    //       className="btn btn-info btn-lg"
    //       data-toggle="modal"
    //       data-target="#myModal"
    //     >Open Modal</button>
    //     <div id="myModal" className="modal fade" role="dialog">
    //       <div className="modal-dialog">
    //         <div className="modal-content">
    //           <div className="modal-header">
    //             <button type="button" className="close" data-dismiss="modal">&times;</button>
    //             <h4 className="modal-title">Modal Header</h4>
    //           </div>
    //           <div className="modal-body">
    //             <p>Some text in the modal.</p>
    //           </div>
    //           <div className="modal-footer">
    //             <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // );
  }
}
