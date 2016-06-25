import { h, Component } from 'preact';
import FootballTeam from './FootballTeam';

type PropsType = {}

type StateType = {}

type ResponseType = {}

const GK = 1;
const CB = 2;
const FB = 3;
const DM = 4;
const AM = 5;
const CM = 6;

const WG = 7;
const FW = 8;

export default class Football extends Component {
  state = {};

  componentWillMount() {
  }

  getLeftTeam = () => {
    return [{
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
    }
    ];
  };

  getRightTeam = () => {
    return this.getLeftTeam();
  };

  render(props: PropsType, state: StateType) {
    return (
      <div className="white page">
        <div style="width: 300px; float: left;">
          <FootballTeam team={this.getLeftTeam()} />
        </div>
        <div style="width: 300px; float: left;">ТРАНСЛЯЦИЯ</div>
        <div style="width: 300px; float: left;">
          <FootballTeam team={this.getLeftTeam()} />
        </div>
      </div>
    );
  }
}
