import { h, Component } from 'preact';
import store from '../../stores/ProfileStore';
import actions from '../../actions/ProfileActions';
import * as c from '../../constants/constants';
import request from 'superagent';
import stats from '../../helpers/stats';

import PackCard from '../Packs/PackCard';

import Modal from './Modal';

type PropsType = {
  message: {
    data: Object,
    messageID: string,
    type: string,
  },
  count: number,
  // state: Object,
}

type StateType = {
  visible: boolean,
}

type ResponseType = {}

export default class NotificationModalContainer extends Component {
  state = {
    visible: true,
  };

  componentWillMount() {
  }

  skip = (text, id) => {
    return (
      <button
        className="btn btn-primary"
        onClick={this.hide}
      >{text}</button>
    );
  };

  hide = () => {
    // $("#modal-standard").modal('hide');
    this.setState({ visible: false });
    actions.loadNews();
  };

  answer = (code, messageID) => {
    request.get(`message/action/${code}/${messageID}`);
    this.hide();
  };

  // buttons = {
  //   action: (code, messageID, style) => {
  //     return <a className="btn btn-primary" onClick={this.answer(code, messageID)}>{style.text}</a>;
  //   },
  // };

  modal_pic = (name) => {
    return <div><br /><img alt="" style="width:100%" src={`/img/${name}`} /></div>;
  };

  winningPicture = () => this.modal_pic('win_1.png');

  ratingPicture = () => this.modal_pic('win_2.jpg');

  losePicture = () => this.modal_pic('lose_1.jpg');

  getModalData = (message, info, messageID) => {
    // console.log('getModalData');
    let header = '';
    let body = '';
    let footer = '';
    let invisible = false;

    let money = store.getMoney();

    try {
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
          footer = (
            <a
              className="btn btn-primary"
              onClick={() => { this.answer(0, messageID); }}
            >Спасибо</a>
          );
          break;
        case c.NOTIFICATION_CUSTOM:
          header = info.header;
          body = info.text;

          if (info.imageUrl) {
            body += this.modal_pic(info.imageUrl);
          }

          footer = this.skip('Хорошо', messageID);
          break;
        case c.NOTIFICATION_FIRST_MESSAGE:
          const mainPrize = info.mainPrize;
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
          console.log('messageID of NOTIFICATION_WIN_MONEY is', messageID);
          let txt = main(`Вы выиграли ${info.prizes[0]} РУБ !! Так держать!`);
          header = `Вы победили в турнире #${info.tournamentID}`;

          body = (
            <div>
              {txt}
              {this.winningPicture()}
            </div>
          );

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
          body = (
            <div>
              <p className="card-title">{card.description}</p>
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
        case c.NOTIFICATION_TOURNAMENT_START:
          header = 'Турниры начинаются!';
          body = 'КНОПКИ КНОПКИ';
          footer = '';
          break;
        case c.MODAL_NO_TOURNAMENT_MONEY:
          header = 'Упс... не хватает средств';
          let diff = info.ammount - money;

          body = (
            <div className="card-title">
              Пополните счёт и вы сможете сыграть в этом турнире!
              <br />
              Стоимость турнира: {info.ammount} РУБ
              <br />
              У вас на счету: {money} РУБ
            </div>
          );

          footer = (
            <div>
              <a
                href="/Payment"
                className="btn btn-primary"
                onClick={stats.pressedModalTournamentNoMoney}
              >Пополнить на {diff} руб</a>
            </div>
          );
          break;
        case c.MODAL_NO_PACK_MONEY:
          header = 'Упс... не хватает средств';
          diff = info.ammount - money;

          body = (
            <div className="card-title">
              Пополните счёт и вы сможете открыть этот пак!
              <br />
              Стоимость пака: {info.ammount} РУБ
              <br />
              У вас на счету: {money} РУБ
            </div>
          );

          footer = (
            <div>
              <a
                href="/Payment"
                className="btn btn-primary"
                onClick={stats.pressedModalPackNoMoney}
              >Пополнить на {diff} руб</a>
            </div>
          );
          break;
        default:
          console.warn('no such modal type', message.type);
          break;
      }
    } catch (e) {
      console.error('error in modals', e);
    }
    return { header, body, footer, invisible };
  };

  componentWillReceiveProps() {
    this.setState({ visible: true });
  }

  render(props:PropsType, state: StateType) {
    const message = props.message;
    const data = message.data || {};
    const messageID = message["_id"] || 0;

    const modalData = this.getModalData(message, data, messageID);
    const drawData = Object.assign({}, modalData, { count: props.count, messageID });
    // console.log('draw notification modal container', drawData);

    return <Modal data={drawData} hide={!state.visible} onClose={this.hide} />;
  }
}
