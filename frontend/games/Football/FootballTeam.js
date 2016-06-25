import { h, Component } from 'preact';

type Footballer = {
  name: string,
  form: number,
  position: number,
  rating: number,
  skills: Object,
}

type PropsType = {
  team: Array<Footballer>,
  name: string,
  isUserTeam: boolean,
}

type StateType = {
  selected: number,
  substitutions: number,
}

const GK = 1;
const CB = 2;
const FB = 3;
const DM = 4;
const AM = 5;
const CM = 6;

const WG = 7;
const FW = 8;

type ResponseType = {}

export default class FootballTeam extends Component {
  state = {
    selected: -1,
    substitutions: 3,
  };

  componentWillMount() {}

  render(props: PropsType, state: StateType) {
    const playerList = props.team.map((p: Footballer, i: number) => {
      return (
        <div>
          <div
            className={`white page footballer ${props.isUserTeam ? 'light-blue' : ''}`}
          >{p.name}
          </div>
          <div className={i !== 10 ? 'hide' : ''}>
            <hr width="60%" color="white" />
            <div>Запасные</div>
            <br />
          </div>
        </div>
      );
    });
    return (
      <div>
        <h2>{props.name}</h2>
        {playerList}
      </div>
    );
  }
}
