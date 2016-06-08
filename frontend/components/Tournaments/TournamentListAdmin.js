import { h, Component } from 'preact';
import request from 'superagent';

import TournamentAdmin from './TournamentAdmin';
type TournamentType = {
  tournamentID: number,
  status: number,
  settings: Object,
  players: number,
  goNext: Array<number>,
  Prizes: Array,
}

type StateType = {
  tournaments: Array<TournamentType>,
}

type ResponseType = {
  body: {
    tournaments: Array<TournamentType>,
  }
}

export default class TournamentListAdmin extends Component{
  state = {
    tournaments: [],
  };

  componentWillMount() {
    request
      .get('/api/tournaments/available')
      .end((err, res: ResponseType) => {
        if (err) throw err;
        this.setState({ tournaments: res.body.tournaments });
      });
  }

  render(state: StateType) {
    const TournamentList = state.tournaments.map((t: TournamentType) => {
      return (
        <TournamentAdmin data={t} />
      );
    });

    return (
      <div>
        LIst Admin
        {TournamentList}
      </div>
    );
  }
}
