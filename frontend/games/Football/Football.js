import { h, Component } from 'preact';
import FootballTeam from './FootballTeam';

type PropsType = {}

type StateType = {
  mode: string,
  team: string,
}

type ResponseType = {}

const MODE_CHOOSE_TEAM = 'MODE_CHOOSE_TEAM';
const MODE_WAIT_OPONENT = 'MODE_WAIT_OPONENT';

const GK = 1;
const CB = 2;
const FB = 3;
const DM = 4;
const AM = 5;
const CM = 6;

const WG = 7;
const FW = 8;

const teamnames = ['realmadrid', 'manunited'];
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
    }
    ],
    cover: '/img/topics/realmadrid.jpg',
  },
  manunited: {
    players: [{
      name: 'De Gea',
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
    }
    ],
    cover: '/img/topics/manutd.jpg',
  }
};

export default class Football extends Component {
  state = {
    mode: MODE_CHOOSE_TEAM,
    teamname: 'none',
  };

  componentWillMount() {
  }

  getLeftTeam = (name) => {
    return teams[name];
  };

  getRightTeam = (name) => {
    return teams[name];
  };

  chooseTeam = (team) => {
    console.log('chosen: ', team);
    this.setState({ team, mode: MODE_WAIT_OPONENT });
  };

  render(props: PropsType, state: StateType) {
    if (state.mode === MODE_CHOOSE_TEAM) {
      console.log('MODE_CHOOSE_TEAM');
      let teamList = teamnames.map(name =>
        <div
          className={`responsive football-team-image img-wrapper football-team-${name}`}
          onClick={() => { this.chooseTeam(name); }}
        ></div>
      );
      return (
        <div>
          <center>
            <h2 className="white page">Выберите команду</h2>
            {teamList}
          </center>
        </div>
      );
    }
    return (
      <center>
        <div className="white page">
          <div className="football-team left">
            <FootballTeam team={this.getLeftTeam('realmadrid')} isUserTeam />
          </div>
          <div className="football-translation">ТРАНСЛЯЦИЯ</div>
          <div className="football-team right">
            <FootballTeam team={this.getLeftTeam('manunited')} />
          </div>
        </div>
      </center>
    );
  }
}
