import { h, Component } from 'preact';
import { TournamentType } from '../types';
import TournamentChecker from '../../helpers/tournamentTypeChecker';
import constants from '../../constants/constants';

import prizeChecker from '../../helpers/prizes/prize-type-checker';

type PropsType = {
  authenticated: boolean,
  registeredInTournament: boolean,

  data: TournamentType,

  register: Function,
  unregister: Function,
  onSelected: Function,
  isSelected: boolean,
}

function getFormOfParticipants(num) {
  const modulo = num % 10;
  if (modulo === 1) return 'игрок';

  if (modulo > 1 && modulo < 5) return 'игрока';
  // if (modulo === 0 || modulo >= 5)
  return 'игроков';
}

function phrase(num: number, wordOne, word14, wordLot) {
  const modulo = num % 10;
  let word = wordLot;
  if (modulo === 1) word = wordOne;

  if (modulo > 1 && modulo < 5) word = word14;

  return `${num} ${word}`;
}

function sphrase(num, word) { // именит падеж: игрок
  return phrase(num, word, `${word}а`, `${word}ов`);
}

function formatDate(date1) {
  if (!date1) return '';
  const date = new Date(date1);
  // console.log('forced data', date);
  const options = {
    // era: 'long',
    // year: 'numeric',
    month: 'long',
    day: 'numeric',
    // weekday: 'long',
    // timezone: 'UTC',
    hour: 'numeric',
    minute: 'numeric',
    // second: 'numeric'
  };
  const localed = date.toLocaleString('ru', options);
  // console.log('localed time', localed);
  return localed;
}

function roman(number) {
  switch (number) {
    case 1: return 'I';
    case 2: return 'II';
    case 3: return 'III';
    case 4: return 'IV';
    case 5: return 'V';
    case 6: return 'VI';
    case 7: return 'VII';
    case 8: return 'VIII';
    case 9: return 'IX';
    case 10: return 'X';
    default: return number;
  }
}

export default class Tournament extends Component {
  renderActionButtons = (props: PropsType) => {
    let actionButtons = '';
    const { buyIn, tournamentID } = props.data;

    if (props.authenticated) {
      if (props.registeredInTournament) {
        actionButtons = (
          <a className="btn toggle-tickets wrap-text">
            Вы участвуете в турнире
            <br />
            Дождитесь начала
          </a>
        );
      } else {
        const text = buyIn > 0 ? `за ${buyIn} РУБ` : 'бесплатно';
        actionButtons = (
          <a className="btn toggle-tickets wrap-text" onClick={() => props.register(tournamentID, buyIn)}>
            Участвовать {text}
          </a>
        );
      }
    }
    return actionButtons;
  };

  renderStartConditions = (props: PropsType) => {
    const date = props.data.startDate;// || new Date();
    const formattedDate = formatDate(date);
    const frees = props.data.goNext[0] - props.data.players;
    // console.log('startConditions', props.data.tournamentID, date);

    if (date) {
      return <div>Турнир начнётся {formattedDate}</div>;
    }

    if (frees === 0) {
      return <div>Свободных мест нет</div>;
    }

    return <div>Свободных мест: {frees}</div>;
  };

  pickTournamentCoverColour = (id) => {
    const modulo = id % 10;
    switch (modulo) {
      case 1: return 'green';
      case 2: return 'red';
      case 3: return 'purple';
      case 4: return 'pomegranate';
      case 5: return 'blue';
      case 6: return 'pomegranate';
      case 7: return 'darkblue';
      case 8: return 'pomegranate';
      case 9: return 'purple';
      default: return '';
    }
  };

  renderPrizeText = (t: TournamentType) => {
    if (TournamentChecker.isRma(t)) {
      // на раунд {t.settings.round}
      let phrase = 'в финал';

      if (t.settings.round > 0) {
        phrase = `на раунд ${t.settings.round}`;
      }

      return (
        <div>
          <div>Призы</div>
          <span>билеты {phrase}</span>
          <div>{phrase}</div>
        </div>
      )
    }

    const moneyEquivalent = t.Prizes
      .filter(p => p.type === constants.PRIZE_TYPE_MONEY)
      .map(p => parseInt(p.info, 10));

    return (
      <div>
        <div>Призовой фонд</div>
        <span>{moneyEquivalent.reduce((p, c) => p + c, 0)} Р</span>
      </div>
    )
  };

  renderPrizeList = (prizes) => {
    return prizes.map(this.renderPrize);
  };

  renderPrize = (p, i: number) => {
    if (prizeChecker.isMoneyPrize(p)) {
      return <p>{i + 1}-е место: {p.info} РУБ</p>;
    }

    if (prizeChecker.isTicketPrize(p)) {
      return <p>{i + 1}-е место: билет на турнир №{p.info}</p>
    }

    if (prizeChecker.isPointPrize(p)) {
      return <p>{i + 1}-е место: {p.info} баллов</p>
    }

    if (prizeChecker.isGiftPrize(p)) {
      return <p>{i + 1}-е место: ПРИЗ</p>
    }

    if (prizeChecker.isCustomPrize(p)) {
      return <p>{i + 1}-е место: {p.info}</p>
    }

    if (prizeChecker.hasNoTypeSpecified(p)) {
      return <p>{i + 1}-е место: {p} РУБ</p>;
    }

    return <p>Ошибка: {JSON.stringify(p)}</p>
  };

  render(props: PropsType) {
    const id = props.data.tournamentID;

    const prizes = props.data.Prizes || [100, 20, 20, 5]; //
    const prizeList = this.renderPrizeList(prizes);
    const buyIn = props.data.buyIn;

    const maxPlayers = props.data.goNext[0];

    // const coverUrl = `/img/topics/default.jpg`;
    const coverUrl = `/img/logo.png`;
    const color = 'white';
    const coverColor = this.pickTournamentCoverColour(id);

    const easiest = 'Проще простого';
    const easy = 'Вполне по силам';
    const middle = 'Средне';
    const impossible = 'Будет жарко';

    let difficulty = easiest;

    if (maxPlayers > 5) {
      if (maxPlayers > 28) {
        if (maxPlayers > 100) {
          difficulty = impossible;
        } else {
          difficulty = middle;
        }
      } else {
        difficulty = easy;
      }
    }

    let playerCount = props.data.players;

    const startDate = props.data.startDate;
    if (!startDate) {
      playerCount = `${props.data.players}/${props.data.goNext[0]}`;
    }

    const cost = buyIn === 0 ? 'БЕСПЛАТНО' : `Стоимость: ${buyIn} руб`;
        // <img src={coverUrl} alt="" />
    let participants = (
      <div>
        <div className="going" id={`plrs-${id}`}>
          <i className="fa fa-group fa-lg" />
          Игроки : {props.data.players}/{props.data.goNext[0]}
        </div>
        <div className="tickets-left">№{id}</div>
      </div>
    );

    const participating = props.registeredInTournament ? 'participating' : '';
    const ticketCardClassName = `ticket-card ${participating} light-blue bounceIn`;

    // killPaddings
    //   <div className="col-sm-6 col-md-4">
    //   <div className="" style="width: 305px; display: inline-block; margin: 7px;">
    // style="width: 300px; display: inline-block;"
    // box-shadow: 0 0 5px 2px rgba(0,0,0,.35);
    // <div className="from">Призы</div>
    // box-shadow: -5px -5px 9px 5px rgba(0,0,0,0.4);

    // <div>Главный приз</div>
    // <span>+{prizes[0]} Р</span>

    const cover = (
      <div className="cover" onClick={() => props.onSelected(id)}>
        <div className="tournament-cover">
          <p style={{ color }} className="fa fa-user fa-lg fa-1x" aria-hidden="true" >
            &nbsp;&nbsp;{playerCount}
          </p>
        </div>
        <div className="tournament-difficulty">Сложность<br />{difficulty}</div>
        <div className={`tournament-date-start`}>
          <p style={{ color }} className="fa fa-star fa-lg fa-1x">
            &nbsp;Призов: {prizes.length}
          </p>
        </div>
        <div className={`tournament-users ${startDate ? 'show' : 'hide'}`}>
          {formatDate(startDate)}
        </div>
        <div className="tournament-prize-count"></div>
        <div className="tournament-cost">{cost}</div>
        <div className={`tournament-cover-container ${coverColor}`}>
          <div className="tournament-centerize">
            <div className="white tournament-cover-text">
              {this.renderPrizeText(props.data)}
            </div>
          </div>
        </div>
      </div>
    );
    // <div
    //   className="tournament-cover-container"
    //   style="background-color: rgba(0,0,0,0.05); position: absolute; left: 0; right: 0; top: 0; bottom: 0;"
    // ></div>
    // #303030

    let tournamentSpecialID = '';
    if (prizes[0] === 50) {
      tournamentSpecialID = 'daily';
    }

    return (
      <div className="col-sm-6 col-md-4" id={tournamentSpecialID}>
        <div className={ticketCardClassName} id={`bgd${id}`}>
          {cover}
          <div className={`tournament-body ${participating} ${props.isSelected ? '' : 'hide'}`}>
            <div className="body">
              <div className="">Турнир №{id}</div>
              <br />
              <div className="price text-center">
                <div className="value">{prizeList}</div>
              </div>
              <div className="clearfix"></div>
              <div className="clearfix"></div>
            </div>
            <div className="collapse"></div>
            <div className="info text-center">{this.renderStartConditions(props)}</div>
            <br />
            <div className="footer" id={`footer${id}`}>{this.renderActionButtons(props)}</div>
          </div>
        </div>
      </div>
    );
  }
}
