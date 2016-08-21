import { h, Component } from 'preact';
import * as types from '../types';

import sendError from '../../helpers/sendError';

import actions from '../../actions/AdminActions';

type PropsType = {
  tournament: types.TournamentType,
  // "/AddTournament" or /api/tournaments/edit/:tournamentID
  action: string,
  phrase: string,

  onChange: Function
}

type StateType = {
  tournament: types.TournamentType,
}

export default class TournamentEditor extends Component {
  onChange = (name, value) => {
    this.props.onChange(name, value);
  };

  onBuyInChange = (e: KeyboardEvent) => {
    const buyIn = e.target.value;

    if (!isNaN(buyIn)) this.onChange('buyIn', buyIn);
  };

  onGoNextChange = (e: KeyboardEvent) => {
    const data = e.target.value;
    if (Array.isArray(data)) {
      this.onChange('goNext', Array.from(data));
    }
  };

  onPrizesChange = (e: KeyboardEvent) => {
    const data = e.target.value;
    if (Array.isArray(data)) {
      this.onChange('Prizes', Array.from(data));
    }
  };

  onSettingsChange = (e: KeyboardEvent) => {
    const data = e.target.value;
    try {
      const settings = JSON.parse(data);
      this.onChange('settings', settings);
    } catch (err) {
      sendError(err, 'onSettingsChange');
    }
  };

  onDateChange = (e: KeyboardEvent) => {
    const data = e.target.value;
    console.log('onDateChange', data);

    try {
      const startDate = Date.parse(data);
      console.log('onDateChange try', startDate);
      this.onChange('startDate', new Date(startDate));
    } catch (err) {
      sendError(err, 'onDateChange');
    }
  };

  doubleDigit(value) {
    return value < 10 ? `0${value}` : value;
  };

  datepickerFormat = (date: Date) => {
    console.log('datepickerFormat', date);
    // console.log('datepickerFormat', date.getDate());
    const d = date.getDate();
    const DD = this.doubleDigit(d);

    const M = date.getMonth() + 1;
    const MM = this.doubleDigit(M);

    const h = date.getUTCHours();
    const hh = this.doubleDigit(h);

    const m = date.getMinutes();
    const mm = this.doubleDigit(m);

    return `${date.getFullYear()}-${MM}-${DD}T${hh}:${mm}`;
  };

  render(props: PropsType, state: StateType) {
    const tournament: types.TournamentType = props.tournament;

    let {
      gameNameID,
      tournamentID,
      buyIn,
      status,
      startDate,
      players,
      goNext,
      Prizes,

      settings,
      rounds
    } = tournament;

    let regularity = 0;
    let visibility = true;
    let tag = '';
    let topic = '';

    if (settings) {
      //  && Object.keys(settings).length
      regularity = settings.regularity || 0;
      tag = settings.tag || '';
      topic = settings.topic || '';
    }

    gameNameID = 2;
    return (
      <div>
        add tournament
        <form action={props.action} method="post">
          <table border="1" cellpadding="10" cellspacing="0" bordercolor="000000">
            <tbody>
            <tr>
              <td>Game Name</td>
              <td>
                <select name="gameNameID" value={gameNameID}>
                  <option value="2">Questions</option>
                  <option value="3">Battle</option>
                  <option value="1">Ping Pong</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>Rounds</td>
              <td>
                <select name="rounds" value={rounds}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>Buy In</td>
              <td>
                <input name="buyIn" value={`${buyIn}`} onChange={this.onBuyInChange} />
              </td>
            </tr>
            <tr>
              <td>goNext</td>
              <td>
                <input type="text" name="goNext" value={JSON.stringify(goNext)} onChange={this.onGoNextChange} />
              </td>
            </tr>
            <tr>
              <td>Prizes</td>
              <td>
                <input type="text" name="Prizes" value={JSON.stringify(Prizes)} onChange={this.onPrizesChange} />
              </td>
            </tr>
            <tr>
              <td>Tournament start date</td>
              <td>
                <input type="datetime-local" value={this.datepickerFormat(startDate)} onChange={this.onDateChange} />
                <button onClick={() => { this.onChange('startDate', null) }}>CLEAR DATE</button>
              </td>
            </tr>
            <tr>
              <td>Settings</td>
              <td>
                <input name="settings" value={JSON.stringify(settings)} onChange={this.onSettingsChange} />
              </td>
            </tr>
            </tbody>
          </table>
          <input value={JSON.stringify(props.tournament)} style="width: 100%;" />
          <input type="submit" value={props.phrase} />
        </form>
      </div>
    );
  }
}
