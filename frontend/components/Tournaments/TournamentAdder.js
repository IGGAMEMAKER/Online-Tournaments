import { h, Component } from 'preact';
import * as types from '../types';
type PropsType = {
  tournament: types.TournamentType,
  // "/AddTournament" or /api/tournaments/edit/:tournamentID
  action: string,
  phrase: string
}

type StateType = {
  tournament: types.TournamentType,
}

export default class TournamentEditor extends Component {
  render(props: PropsType, state: StateType) {
    const t: types.TournamentType = props.tournament;

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
    } = t;

    let regularity = 0;
    let visibility = true;
    let tag = '';
    let topic = '';

    if (settings && Object.keys(settings).length) {
      regularity = settings.regularity || 0;
      tag = settings.tag || '';
      topic = settings.topic || '';
    }

    gameNameID = 2;

    /*

     <tr>
     <td>special</td>
     <td>
     <select id="special" name="special">
     <option value="0">none</option>
     <option value="1">special</option>
     </select>
     </td>
     </tr>
     <tr>
     <td>hidden+topic</td>
     <td>
     <select name="hidden">
     <option value="0">none</option>
     <option value="1">realmadrid</option>
     </select>
     </td>
     </tr>
     <tr>
     <td>specPrizeName</td>
     <td>
     <input type="text" name="specPrizeName" />
     </td>
     </tr>
     <tr>
     <td>Tag</td>
     <td>
     <input name="tag" value={tag} />
     </td>
     </tr>

     */


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
                <input name="buyIn" value={`${buyIn}`} />
              </td>
            </tr>
            <tr>
              <td>goNext</td>
              <td>
                <input type="text" name="goNext" value={JSON.stringify(goNext)} />
              </td>
            </tr>
            <tr>
              <td>Prizes</td>
              <td>
                <input type="text" name="Prizes" value={JSON.stringify(Prizes)} />
              </td>
            </tr>
            <tr>
              <td>Tournament start date</td>
              <td>
                <input type="datetime-local" value={new Date()} />
              </td>
            </tr>
            <tr>
              <td>Settings</td>
              <td>
                <input name="settings" value={JSON.stringify(settings)} />
              </td>
            </tr>
            </tbody>
          </table>
          <input type="submit" value={props.phrase} />
        </form>
      </div>
    );
  }
}
