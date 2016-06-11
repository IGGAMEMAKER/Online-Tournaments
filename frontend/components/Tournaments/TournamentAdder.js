import { h, Component } from 'preact';
import * as types from '../types';
type PropsType = {}

type StateType = {
  tournament: types.TournamentType,
}

type ResponseType = {}

export default class StdClass extends Component {
  state = {
  };

  componentWillMount() {}

  render(props: PropsType, state: StateType) {
    return (
      <div>
        add tournament
        <form id="tournamentAdder" action="/AddTournament" method="post">
        </form>
      </div>
    );
  }
}
