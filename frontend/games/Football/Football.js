import { h, Component } from 'preact';
import FootballTeam from './FootballTeam';

type PropsType = {}

type TeamSettings = {
  side: number,
  passing: number,
  defence: number,
  fouls: number,
  attack: number,
}
/*
 атаковать через:
 лев центр прав

 передачи
 длин коротк средн

 линия защиты
 низк, средн, высок

 фолы
 мало средн много

 тип атаки
 медлен (как РФ)
 средн (позиционное наступление без особого риска)
 средн (позиционное наступление + риск)
 быстрая (контра)
 */

type TranslationMessage = {
  text: string,
}

type StateType = {
  mode: string,
  team: string,

  settings: TeamSettings,

  scored: number,
  conceded: number,
  time: number,
  messages: Array<TranslationMessage>,
}

type ResponseType = {}

const MODE_INITIALIZE = 'MODE_INITIALIZE';
const MODE_INTRO = 'MODE_INTRO';
const MODE_CHOOSE_TEAM = 'MODE_CHOOSE_TEAM';
const MODE_WAIT_OPPONENT = 'MODE_WAIT_OPPONENT';
const MODE_MAKE_SQUAD = 'MODE_MAKE_SQUAD';

const GK = 1;
const CB = 2;
const FB = 3;
const DM = 4;
const AM = 5;
const CM = 6;

const WG = 7;
const FW = 8;

const teamnames = ['realmadrid', 'manunited'];

const funnyPhrases = [
  'Брюки Зидана представляют...',
  'Плащ Зидана представляет...',
  'Я один прочитал "Касильяс" ?',
  'Укус Суарес представляет...',
  'Яйца Лёва представляют...',
  'Мимика Моу представляет...',
  'Покер Смолова представляет...',
  'Дриблинг Арбелоа представляет...',
];

const teams = {
  realmadrid: {
    players: [{
      name: 'Navas',
      position: GK,
    }, {
      name: 'Pepe',
      position: CB,
    }, {
      name: 'Ramos',
      position: CB,
    }, {
      name: 'Marcelo',
      position: FB,
    }, {
      name: 'Carvajal',
      position: FB,
    }, {
      name: 'Casemiro',
      position: DM,
    }, {
      name: 'Modric',
      position: CM,
    }, {
      name: 'Kroos',
      position: CM,
    }, {
      name: 'Ronaldo',
      position: WG,
    }, {
      name: 'Bale',
      position: WG,
    }, {
      name: 'Benzema',
      position: FW,
    }, {
      name: 'Casilla',
      position: GK,
    }, {
      name: 'Yanez',
      position: GK,
    }, {
      name: 'Varane',
      position: CB,
    }, {
      name: 'Nacho',
      position: CB,
    }, {
      name: 'Danilo',
      position: FB,
    }, {
      name: 'James',
      position: AM,
    }, {
      name: 'Kovacic',
      position: CM,
    }, {
      name: 'Isco',
      position: AM,
    }, {
      name: 'Jese',
      position: WG,
    }, {
      name: 'Vazquez',
      position: WG,
    }, {
      name: 'Mayoral',
      position: FW,
    }, {
      name: 'Morata',
      position: FW,
    },
    ],
    cover: '/img/topics/realmadrid.jpg',
  },
  manunited: {
    players: [{
      name: 'De Gea',
      position: GK,
    }, {
      name: 'Blind',
      position: CB,
    }, {
      name: 'Smalling',
      position: CB,
    }, {
      name: 'Shaw',
      position: FB,
    }, {
      name: 'Darmian',
      position: FB,
    }, {
      name: 'Schweinsteiger',
      position: DM,
    }, {
      name: 'Carrick',
      position: CM,
    }, {
      name: 'Rooney',
      position: CM,
    }, {
      name: 'Martial',
      position: WG,
    }, {
      name: 'Mata',
      position: WG,
    }, {
      name: 'Rashford',
      position: FW,
    }, {
      name: 'Casilla',
      position: GK,
    }, {
      name: 'Yanez',
      position: GK,
    }, {
      name: 'Rojo',
      position: CB,
    }, {
      name: 'Nacho',
      position: CB,
    }, {
      name: 'Isco',
      position: AM,
    }, {
      name: 'James',
      position: AM,
    }, {
      name: 'Covacic',
      position: CM,
    }, {
      name: 'Isco',
      position: AM,
    }, {
      name: 'Jese',
      position: WG,
    }, {
      name: 'Vazquez',
      position: WG,
    }, {
      name: 'Mayoral',
      position: FW,
    }, {
      name: 'Morata',
      position: FW,
    }],
    cover: '/img/topics/manutd.jpg',
  }
};
/*
 {
 name: 'Khedira',
 position: DM,
 }
 */
export default class Football extends Component {
  state = {
    // mode: MODE_INITIALIZE,
    mode: MODE_MAKE_SQUAD,
    team: 'realmadrid',
    selected: -1,

    scored: 0,
    conceded: 0,
    time: 0,

    messages: [
      { text: 'Матч начинается!' },
      { text: 'Мяч в цетре поля, идёт нешуточная борьба за него' },
      { text: 'Удар! Это было опасно!' },
      { text: 'ГООООООЛ!!!!!! ВЕЛИКОЛЕПНОЕ ЗАВЕРШЕНИЕ!!!' },
      { text: 'Modric отбирает мяч, что же будет дальше?' },
      { text: 'Длинная передача на ход вингеру' },
    ],
  };

  componentWillMount() {
    // const timeout = 3000;
    // setTimeout(() => { this.setState({ mode: MODE_CHOOSE_TEAM }); }, timeout);
  }

  getFunnyPhrase = () => {
    const date = new Date();
    const index = date.getTime() % funnyPhrases.length;
    return funnyPhrases[index];
  };

  getLeftTeam = () => {
    console.log('get my team', this.state.team, teams);
    return teams[this.state.team];
  };

  getRightTeam = (name) => {
    return teams[name];
  };

  getPlayerById = (team, id) => {
    return Object.assign({}, teams[team].players[id]);
  };

  makeSub = (id, state: StateType) => {
    const selected = state.selected;
    const was = this.getMyPlayerById(state);
    const sub = this.getPlayerById(state.team, id);

    teams[state.team].players[selected] = sub;
    teams[state.team].players[id] = was;
    this.setState({ selected: -1 });
  };

  getPlayers = (state: StateType): Array => {
    console.log('getPlayers', state);
    return teams[state.team].players;
  };

  getMyPlayerById = (state: StateType) => {
    return Object.assign({}, teams[state.team].players[state.selected]);
  };

  chooseTeam = (team) => {
    console.log('chosen: ', team);
    setTimeout(() => { this.setState({ mode: MODE_MAKE_SQUAD }); }, 3000);
    this.setState({ team, mode: MODE_WAIT_OPPONENT });
  };

  selectPlayer = (i) => {
    this.setState({ selected: i });
  };

  render(props: PropsType, state: StateType) {
    if (state.mode === MODE_INITIALIZE) {
      return (
        <div>
          <h2 className="white page">{this.getFunnyPhrase()}</h2>
        </div>
      );
    }

    // if (state.mode === MODE_INTRO) {
    //   return (
    //     <div>
    //       <h1 className="white page">Football</h1>
    //       <button
    //         className=""
    //         onClick={() => { this.setState({ mode: MODE_CHOOSE_TEAM }); }}
    //       >ИГРАТЬ</button>
    //     </div>
    //   );
    // }

    if (state.mode === MODE_CHOOSE_TEAM) {
      let teamList = teamnames.map(name =>
        <div
          className={`responsive football-team-image img-wrapper football-team-${name}`}
          onClick={() => { this.chooseTeam(name); }}
        ></div>
      );
      return (
        <div>
          <center>
            <h1 className="white page">Football</h1>
            <h2 className="white page">Выберите команду</h2>
            {teamList}
          </center>
        </div>
      );
    }

    if (state.mode === MODE_WAIT_OPPONENT) {
      return (
        <div>
          <h2 className="white page">Поиск оппонента...</h2>
          <div className="img-loading responsive"></div>
        </div>
      );
    }

          // <progress>hhh</progress>
    let subs;
    const selected = state.selected;
    if (selected >= 0 && selected < 11) {

      const footballer = this.getMyPlayerById(state);

      // const expectedSubs = 'expectedSubs';
      const expectedSubs = this.getPlayers(state)
        .map((p, i) => Object.assign({ index: i }, p))
        .filter(
          (p, i) => {
            const position = footballer.position;
            const positionIsSame =
              p.position === footballer.position ||
              (position === CB && p.position === DM) ||
              (position === FB && p.position === CB) ||
              (position === DM && (p.position === CB || p.position === CM)) ||
              (position === CM && (p.position === DM || p.position === AM)) ||
              (position === AM && p.position === CM) ||
              (position === WG && (p.position === AM || p.position === FW)) ||
              (position === FW && p.position === WG);

            return positionIsSame &&
            i !== selected && !p.wasSubstituted
            && i > 10;
          })
        .map(s => (
          <div>
            <button onClick={() => { this.makeSub(s.index, state); }}>
              выпустить {s.name} вместо {footballer.name}
            </button>
          </div>
        ));
      // &nbsp;{s.index}
      //     <button>Заменить игрока</button>
      subs = (
        <div>
          <div>{footballer.name}</div>
          <div>{footballer.form}</div>
          <div>{footballer.position}</div>
          {expectedSubs}
        </div>
      );
    }

    const messages = state.messages
      .reverse()
      .map((m: TranslationMessage) => (
        <div className="football-translation-text">{m.text}</div>
      ));

    return (
      <center>
        <div className="white page">
          <div className="football-team left">
            <h2 className="white page">Ваша команда</h2>
            <FootballTeam
              isUserTeam
              team={this.getLeftTeam('realmadrid')}
              selectPlayer={this.selectPlayer}
            />
          </div>
          <div className="football-translation">
            {subs}
            <h2>ТРАНСЛЯЦИЯ</h2>
            <h2>{state.scored}:{state.conceded}</h2>
            <h4>Минута: {state.time}</h4>
            {messages}
          </div>
          <div className="football-team right">
            <h2 className="white page">Команда соперника</h2>
            <FootballTeam team={this.getRightTeam('manunited')} />
          </div>
        </div>
      </center>
    );
  }
}
