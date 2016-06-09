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
  startDate: Date,
}

type StateType = {
  tournaments: Array<TournamentType>,
}

type ResponseType = {
  body: {
    msg: Array<TournamentType>,
  }
}

export default class TournamentListAdmin extends Component{
  state = {
    tournaments: [],
  };

  componentWillMount() {
    this.update();
  }

  update = () => {
    request
      .get('/api/tournaments/available')
      .end((err, res: ResponseType) => {
        if (err) throw err;
        // console.log('availables...', res.body);
        this.setState({ tournaments: res.body.msg });
      });
  };

  standardCb = (err, res) => {
    console.log(err, res);
    this.update();
  }

  changeVisibility(id, status) {
    console.log('hidden', id, status);
    request
      .get(`/api/tournaments/hidden/${id}/${status}`)
      .end(this.standardCb);
    /*
     (err, res) => {
     console.log(err, res);
     this.update();
     }
     */
  }

  setStartDate = (date, id) => {
    request
      .post(`/api/tournaments/date/${id}`)
      .send({ startDate: date })
      .end(this.standardCb);
  };

  hideTournament = (id) => {
    this.changeVisibility(id, 'true');
  };

  showTournament = (id) => {
    this.changeVisibility(id, 'false');
  };

  render() {
    const state: StateType = this.state;
    console.log('TournamentListAdmin', state);
    const TournamentList = state.tournaments.map((t: TournamentType) => {
      return (
        <TournamentAdmin
          data={t}
          hideTournament={this.hideTournament}
          showTournament={this.showTournament}
          setStartDate={this.setStartDate}
        />
      );
    });

    return (
      <div>
        LIst Admin
        <table>
          <thead>
            <th>id</th>
            <th>Max</th>
            <th>Winners</th>
            <th>Players</th>
            <th>Prizes</th>
            <th>BuyIn</th>
            <th>hidden</th>
          </thead>
          <tbody>
            {TournamentList}
          </tbody>

        </table>
      </div>
    );
  }
}
