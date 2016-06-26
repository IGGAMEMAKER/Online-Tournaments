import { h, Component } from 'preact';

type Footballer = {
  name: string,
  form: number,
  position: number,
  rating: number,
  skills: Object,
}

type PropsType = {
  team: {
    players: Array<Footballer>
  },
  name: string,
  isUserTeam: boolean,

  selectedPlayer: Function,
}

type StateType = {
  selected: number,
  substitutions: number,
}

// const GK = 1;
// const CB = 2;
// const FB = 3;
// const DM = 4;
// const AM = 5;
// const CM = 6;
//
// const WG = 7;
// const FW = 8;

type ResponseType = {}

export default class FootballTeam extends Component {
  state = {
    selected: -1,
    substitutions: 3,
  };

  componentWillMount() {}

  selectPlayer = (selected, props: PropsType) => {
    if (props.isUserTeam) {
      props.selectPlayer(selected);
      this.setState({ selected });
    }
  };

  render(props: PropsType, state: StateType) {
    console.log('FootballTeam', props.team);
    const playerList = props.team.players.map((p: Footballer, i: number) => {
      let className = `white page footballer ${props.isUserTeam ? 'light-blue' : ''}`;
      if (state.selected === i) {
        className += ' selected';
      }
      return (
        <div>
          <div
            className={className}
            onClick={() => { this.selectPlayer(i, props); }}
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
