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

function convertLocalDateToUTCDate(date: Date) {
  return new Date(date.getFullYear()  )
}

export default class ClassNameSpecial extends Component {
  state = {};

  componentWillMount() {}

  setStartDate = (props: PropsType, id: number) => {
    return () => {
      const date = document.getElementById(`date-input-${id}`).value;

      const localDate = new Date(date);
      const Time = localDate.getTime();
      const offsetMS = localDate.getTimezoneOffset() * 60 * 1000;
      console.log('picked time', new Date(Time), new Date(Time + offsetMS));
      // console.log('picked time', date, localDate.getUTCHours() - (localDate.getTimezoneOffset() / 60), localDate.getMinutes());
      // const d1 = new Date(2017, 3, 4, localDate.getHours(), localDate.getMinutes(), localDate.getSeconds());

      // const year = localDate.getUTCFullYear();
      // const month = localDate.getUTCMonth();
      // const day = localDate.getUTCDate();
      // const hours = localDate.getUTCHours()
      // const d2 = new Date(2017, 3, 4, localDate.getUTCHours(), localDate.getUTCMinutes(), localDate.getUTCSeconds());

      // console.log('picked time', date, localDate);
      // console.log(d1, d2, localDate.getTimezoneOffset());
      // console.log(Date.parse(date));
      // props.setStartDate(localDate, id);
      props.setStartDate(new Date(Time + offsetMS), id);
    };
  };

  render(props: PropsType) {
    // const state: StateType = this.state;
    const id = props.data.tournamentID;

    let visibilityText = 'hide';
    let visibility = () => props.hideTournament(id);

    if (props.data.settings.hidden) {
      visibility = () => props.showTournament(id);
      visibilityText = 'show';
    }
    let dateButton = '';
    const startDate = props.data.startDate;
    if (startDate) {
      dateButton = (
        <button onClick={() => props.clearStartDate(id)}>{startDate} X</button>
      );
    }
    // <td>{props.data.settings.hidden}</td>
    return (
      <tr>
        <td>{id}</td>
        <td>{props.data.players}/{props.data.goNext[0]}</td>
        <td>{props.data.goNext[1]}</td>
        <td>{props.data.Prizes[0]}</td>
        <td>{props.data.buyIn}</td>
        <td>{props.data.status}</td>
        <td>{props.data.settings.regularity}</td>
        <td><button onClick={visibility}>{visibilityText}</button></td>
        <td>
          <option></option>
          {dateButton}
          <input id={`date-input-${id}`} type="datetime-local" />
          <button onClick={this.setStartDate(props, id)}>сменить дату</button>
        </td>
      </tr>
    );
  }
}
