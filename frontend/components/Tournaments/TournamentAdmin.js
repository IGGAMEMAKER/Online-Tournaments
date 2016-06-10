import { h, Component } from 'preact';

type PropsType = {
  data : {
    tournamentID: number,
    status: number,
    settings: Object,
    players: number,
    goNext: Array<number>,
    Prizes: Array,
    startDate: Date,
    buyIn: number,
  },

  hideTournament: Function,
  showTournament: Function,
  setStartDate: Function,
  clearStartDate: Function,
}

type StateType = {};

type ResponseType = {}

export default class ClassNameSpecial extends Component {
  state = {};

  componentWillMount() {}

  setStartDate = (props: PropsType, id: number) => {
    return () => {
      const date = document.getElementById(`date-input-${id}`).value;
      props.setStartDate(date, id);
    };
  };

  render(props: PropsType) {
    // const state: StateType = this.state;
    const id = props.data.tournamentID;

    let visibilityText = 'hide tournament';
    let visibility = () => props.hideTournament(id);

    if (props.data.settings.hidden) {
      visibility = () => props.showTournament(id);
      visibilityText = 'show tournament';
    }
    let dateButton = '';
    const startDate = props.data.startDate;
    if (startDate) {
      dateButton = (
        <button onClick={() => props.clearStartDate(id)}>{startDate} X</button>
      );
    }
    return (
      <tr>
        <td>{id}</td>
        <td>{props.data.goNext[0]}</td>
        <td>{props.data.goNext[1]}</td>
        <td>{props.data.players}</td>
        <td>{props.data.Prizes[0]}</td>
        <td>{props.data.buyIn}</td>
        <td>{props.data.settings.hidden}</td>
        <td>{dateButton}</td>
        <td>
          <button onClick={visibility}>{visibilityText}</button>
        </td>
        <td>
          <label>Date!</label>
          <input id={`date-input-${id}`} type="datetime-local" />
          <button onClick={this.setStartDate(props, id)}>сменить дату</button>
        </td>
      </tr>
    );
  }
}
