/**
 * Created by gaginho on 04.06.16.
 */
import { h, Component } from 'preact';
import request from 'superagent';

import Tournament from './Tournaments/tournament';

type TournamentType = {
  buyIn: number,
  tournamentID: number,
  gameNameID: number,
  status: number,
}

type StateType = {
  tournaments: Array<TournamentType>,
}

type ResponseType = {
  body: {
    tournaments: Array<TournamentType>,
  }
}

export default class Tournaments extends Component {
  state = {
    tournaments: {},
    registeredIn: {},
    options: {},
  };

  componentWillMount() {
    // request
    //   .get('/api/tournaments')
    //   .end((err, res) => {
    //     if (err) {
    //       console.error(err, '/api/tournaments/');
    //       return;
    //     }
    //
    //     const response: ResponseType = res;
    //     this.setState({ tournaments: response.body.tournaments });
    //   });
  }

  register = (tournamentID) => {
    // function reg(login, tID) { ManageReg(login, tID, 'RegisterInTournament', 1); }
    // function unReg(lgn, tID) { ManageReg(login, tID, 'CancelRegister', 0); }
    request
      .post('RegisterInTournament')
      .send({ login, tournamentID })
      .end((err, response) => {
        console.log('RegisterInTournament', err, response);

        let registeredIn = Object.assign({}, this.state.registeredIn);
        registeredIn[tournamentID] = 1;

        this.setState({ registeredIn });
      });
  };

  unregister = (tournamentID) => {
    request
      .post('CancelRegister')
      .send({ login, tournamentID })
      .end((err, response) => {
        console.log('CancelRegister', err, response);

        let registeredIn = Object.assign({}, this.state.registeredIn);
        registeredIn[tournamentID] = null;

        this.setState({ registeredIn });
      });
  };

  render() {
    const state: StateType = this.state;

    const TournamentList = state.tournaments.map((t: TournamentType) => <Tournament
      data={t}
      register={this.register}
      unregister={this.unregister}
      authenticated
      registeredInTournament
    />);

    return <div>{TournamentList}</div>;
  }
}
