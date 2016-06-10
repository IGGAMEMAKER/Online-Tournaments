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

  sortBy: string,
  order: number,
}

type ResponseType = {
  body: {
    msg: Array<TournamentType>,
  }
}

export default class TournamentListAdmin extends Component{
  state = {
    tournaments: [],

    sortBy: 'tournamentID',
    order: 1,
  };

  componentWillMount() {
    // setInterval(() => { this.update(); }, 5000);
    this.update();
  }

  setStartDate = (date, id) => {
    request
      .post(`/api/tournaments/date/${id}`)
      .send({ startDate: date })
      .end(this.standardCb);
  };

  changeVisibility(id, status) {
    console.log('hidden', id, status);
    request
      .get(`/api/tournaments/hidden/${id}/${status}`)
      .end(this.standardCb);
  }

  clearStartDate = (id: number) => {
    request
      .get(`/api/tournaments/clearStartDate/${id}`)
      .end(this.standardCb);
  };

  standardCb = (err, res) => {
    console.log(err, res);
    this.update();
  };

  update = () => {
    request
      .get('/api/tournaments/available')
      .end((err, res: ResponseType) => {
        if (err) throw err;
        console.log('availables...', res.body.msg);
        this.setState({ tournaments: res.body.msg });
      });
  };

  hideTournament = (id) => {
    this.changeVisibility(id, 'true');
  };

  showTournament = (id) => {
    this.changeVisibility(id, 'false');
  };

  setOrder = (name) => {
    return () => {
      const { sortBy, order } = this.state;
      if (sortBy === name) {
        this.setState({ order: order === 1 ? -1 : 1 });
      } else {
        this.setState({ sortBy: name, order: 1 });
      }
    };
  };

  filter = (sort: Function, list: Array<TournamentType>) => {
    return list
      .sort(sort)
      .map((t: TournamentType) => {
        return (
          <TournamentAdmin
            data={t}
            hideTournament={this.hideTournament}
            showTournament={this.showTournament}
            setStartDate={this.setStartDate}
            clearStartDate={this.clearStartDate}
          />
        );
      });
  };

  table = (list) => {
    return (
      <table border="1">
        <thead>
          <th onClick={this.setOrder('tournamentID')}>id</th>
          <th>Players</th>
          <th>Winners</th>
          <th>Prizes</th>
          <th onClick={this.setOrder('buyIn')}>BuyIn</th>
          <th onClick={this.setOrder('status')}>Status</th>
          <th onClick={this.setOrder('settings.regularity')}>Regularity</th>
          <th onClick={this.setOrder('settings.hidden')}>hidden</th>
          <th onClick={this.setOrder('startDate')}>StartDate</th>
        </thead>
        <tbody>{list.length ? list : <th>No such tournaments</th>}</tbody>
      </table>
    );
  };

  render() {
    const state: StateType = this.state;
    const { sortBy, order } = state;
    let v1;
    let v2;
    let sort;
    switch (sortBy) {
      case 'settings.regularity':
        sort = (t1: TournamentType, t2: TournamentType) => {
          v1 = t1.settings.regularity || 0;
          v2 = t2.settings.regularity || 0;
          return (v2 - v1) * order;
        };
        break;
      default:
        sort = (t1: TournamentType, t2: TournamentType) => {
          v1 = t1[sortBy] || 0;
          v2 = t2[sortBy] || 0;
          return (v2 - v1) * order;
        };
        break;
    }
    const Full = this.filter(sort, state.tournaments);

    const runnings = this.filter(sort,
      state.tournaments.filter((t: TournamentType) => t.status === 2)
    );

    // <th>hidden</th>
    /*
     <table border="1">
     <thead>
     <th onClick={this.setOrder('tournamentID')}>id</th>
     <th>Players</th>
     <th>Winners</th>
     <th>Prizes</th>
     <th onClick={this.setOrder('buyIn')}>BuyIn</th>
     <th onClick={this.setOrder('status')}>Status</th>
     <th onClick={this.setOrder('settings.hidden')}>hidden</th>
     <th onClick={this.setOrder('startDate')}>StartDate</th>
     </thead>
     <tbody>
     {TournamentList}
     </tbody>
     </table>
     */
    return (
      <div>
        LIst Admin
        <h1>{sortBy}({order === 1 ? 'По убыванию' : 'По возрастанию'})</h1>
        {this.table(runnings)}
        {this.table(Full)}
      </div>
    );
  }
}
