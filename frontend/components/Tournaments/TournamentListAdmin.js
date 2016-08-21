import { h, Component } from 'preact';
import request from 'superagent';

import constants from '../../constants/constants';

import TournamentAdmin from './TournamentAdmin';
import TournamentEditor from './TournamentAdder';
import TournamentSettingGenerator from './TournamentSettingGenerator';
import TournamentPrizeGenerator from './TournamentPrizeGenerator';

import { TournamentType } from '../types';

import tournamentSortFunction from '../../helpers/tournaments/tournament-admin-sorter';

import actions from '../../actions/AdminActions';
import store from '../../stores/AdminStore';

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

    settings: {
      regularity: constants.REGULARITY_NONE
    },

    newTournament: {
      gameNameID: 2,
      goNext: [2,1],
      Prizes: [],
      buyIn: 0,
      startDate: new Date(),
      settings: {
        "": ""
      }
    }
  };

  componentWillMount() {
    // setInterval(() => { this.update(); }, 5000);
    this.update();

  }

  setStartDate = (date, id) => {
    request.post(`/api/tournaments/date/${id}`).send({ startDate: date }).end(this.standardCb);
  };

  changeVisibility(id, status) {
    console.log('hidden', id, status);
    request.get(`/api/tournaments/hidden/${id}/${status}`).end(this.standardCb);
  }

  clearStartDate = (id: number) => {
    request.get(`/api/tournaments/clearStartDate/${id}`).end(this.standardCb);
  };

  standardCb = (err, res) => {
    console.log(err, res);
    this.update();
  };

  update = () => {
    actions.getAvailableTournaments();
    store.addChangeListener(() => {
      this.setState({
        tournaments: store.getTournaments()
      })
    });
    // request
    //   .get('/api/tournaments/available')
    //   .end((err, res: ResponseType) => {
    //     if (err) throw err;
    //
    //     // console.log('availables...', res.body.msg);
    //     this.setState({ tournaments: res.body.msg });
    //   });
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
          <th><b>ACTIONS</b></th>
        </thead>
        <tbody>{list.length ? list : <th>No such tournaments</th>}</tbody>
      </table>
    );
  };

  onChangeGeneratedSettings = (settings) => {
    console.log('onChangeGeneratedSettings', this.state.settings);

    this.setState({ settings });
  };


  onChangeNewTournament = (name, value) => {
    const obj = {};
    obj[name] = value;

    const newTournament = Object.assign({}, this.state.newTournament, obj);
    console.log('onChangeNewTournament', newTournament);
    this.setState({
      newTournament
    });
  };


  copyGeneratedPrizeToAddingForm = (Prizes) => {
    this.setState({
      newTournament: Object.assign({}, this.state.newTournament, { Prizes })
    });
  };

  render() {
    const state: StateType = this.state;
    const { sortBy, order } = state;

    const sort = tournamentSortFunction(sortBy, order);

    const Full = this.filter(sort, state.tournaments);

    const runnings = this.filter(sort,
      state.tournaments.filter((t: TournamentType) => t.status === 2)
    );

    return (
      <div>
        <table border="1">
          <tr>
            <td>
              <TournamentSettingGenerator
                onChange={this.onChangeGeneratedSettings}
                settings={state.settings}
              />
            </td>

            <td>
              <TournamentPrizeGenerator
                onChange={this.onChangeGeneratedPrizes}
                Prizes={state.Prizes}
                copyGeneratedPrizeToAddingForm={this.copyGeneratedPrizeToAddingForm}
              />
            </td>
            <td>
              <TournamentEditor
                action="/AddTournament"
                phrase="Add tournament"
                tournament={state.newTournament}
                onChange={this.onChangeNewTournament}
              />
              <button onClick={() => { actions.addTournament(state.newTournament)} }>ADD TOURNAMENT</button>
            </td>
          </tr>
          <tr>

          </tr>
        </table>

        LIst Admin
        <h1>{sortBy}({order === 1 ? 'По убыванию' : 'По возрастанию'})</h1>
        <h2>{Date.UTC(111)}</h2>
        {this.table(runnings)}
        {this.table(Full)}
      </div>
    );
  }
}
