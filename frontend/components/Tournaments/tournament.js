/**
 * Created by gaginho on 04.06.16.
 */
import { h, Component } from 'preact';

type TournamentType = {
  tournamentID: number,
  status: number,
  starTime: Date,
  players: number,
  goNext: Array<number>,
  gameNameID: number,
  prizes: Array<number>,

  settings: Object,
}

type PropsType = {
  authenticated: boolean,
  registeredInTournament: boolean,

  data: TournamentType,

  register: Function,
  unregister: Function,

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

function formatDate(date) {
  const options = {
    // era: 'long',
    // year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    // timezone: 'UTC',
    hour: 'numeric',
    minute: 'numeric',
    // second: 'numeric'
  };
  return date.toLocaleString('ru', options);
}

function roman(number) {
  switch (number) {
    case 1: return 'I'; break;
    case 2: return 'II'; break;
    case 3: return 'III'; break;
    case 4: return 'IV'; break;
    case 5: return 'V'; break;
    case 6: return 'VI'; break;
    case 7: return 'VII'; break;
    case 8: return 'VIII'; break;
    case 9: return 'IX'; break;
    case 10: return 'X'; break;
    default: return number; break;
  }
}

export default class Tournament extends Component {
  getActionButtons = (props: PropsType) => {
    let actionButtons = '';
    const buyIn = props.data.buyIn;
    const id = props.data.tournamentID;
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
          <a className="btn toggle-tickets wrap-text" onClick={() => props.register(id)}>
            Участвовать {text}
          </a>
        );
      }
    }
    return actionButtons;
  };

  getStartConditions = (props: PropsType) => {
    const date = props.data.settings.startTime;// || new Date();

    if (date) return <div>Турнир начнётся в {formatDate(date)}</div>;

    return (
      <div>
        Турнир начнётся, когда зарегистрируется
        <br />
        {sphrase(props.data.goNext[0], 'игрок')}
      </div>
    );
  };

  render(props: PropsType) {
    const id = props.data.tournamentID;

    const prizes = props.data.Prizes || [100, 20, 20, 5]; //
    const prizeList = prizes.map((p: number, i: number) => <p>{i + 1}-е место: {p} РУБ</p>);
    const buyIn = props.data.buyIn;

    const cover = (
      <div className="cover">
        <img src="/img/topics/realmadrid.jpg" alt="" />
      </div>
    );

    let participants = (
      <div>
        <div className="going" id={`plrs-${id}`}>
          <i className="fa fa-group fa-lg" />
          Игроки : {props.data.players}/{props.data.goNext[0]}
        </div>
        <div className="tickets-left">№{id}</div>
      </div>
    );

    const players = props.data.players;
    if (players === 0) {
      participants = <div>Стань первым!</div>;
    } else {
      participants = <div>Участвует {players} {getFormOfParticipants(players)}</div>;
    }

    // style="width: 300px; display: inline-block;"
    // box-shadow: 0 0 5px 2px rgba(0,0,0,.35);
    // <div className="from">Призы</div>
    // box-shadow: -5px -5px 9px 5px rgba(0,0,0,0.4);
    const participating = props.registeredInTournament ? 'participating' : '';
    return (
      <div className="col-sm-6 col-md-4 killPaddings">
        <div
          className={`ticket-card ${participating} light-blue-big bounceIn`}
          id={`bgd${id}`}
        >
          {cover}
          <div className="body">
            <div className="info">{participants}</div>
            <br />
            <div className="price text-center">
              <div className="value">{prizeList}</div>
            </div>
            <div className="clearfix"></div>
            <div className="clearfix"></div>
          </div>
          <div className="collapse"></div>
          <div className="info text-center">{this.getStartConditions(props)}</div>
          <br />
          <div className="footer" id={`footer${id}`}>{this.getActionButtons(props)}</div>
        </div>
      </div>
    );
  }
}
