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
  Prizes: Array<number>,
}

type StateType = {
  tournaments: Array<TournamentType>,
}

type ResponseType = {
  body: {
    tournaments: Array<TournamentType>,
  }
}

type ProfileData = {
  body: {
    tournaments: Object,
  }
}

export default class Tournaments extends Component {
  state = {
    tournaments: {},
    registeredIn: {},
    options: {},
  };

  componentWillMount() {
    request
      .post('/Profile')
      .end((err, res) => {
        if (err) throw err;

        const response: ProfileData = res;
        console.log('load profile data', response.body.tournaments);
        this.setState({ registeredIn: response.body.tournaments || {} });
      });
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

  filter = (tournaments, filterFunction) => {
    const registeredIn = this.state.registeredIn || {};
    return tournaments
      .filter(filterFunction)
      .map(t => {
        const registered = registeredIn[t.tournamentID];
        return (
          <Tournament
            data={t}
            register={this.register}
            unregister={this.unregister}
            authenticated
            registeredInTournament={registered}
          />
        );
      }
    );
  };

  render() {
    // const state: StateType = this.state;
    const tourns: Array<TournamentType> = TOURNAMENTS;

      // .filter((t: TournamentType) => t.settings.tag === 'Daily')
    const TodayTournaments = this
      .filter(tourns, ((t: TournamentType) => t.tournamentID % 5 === 0));

    const TomorrowTournaments = this
      .filter(tourns, ((t: TournamentType) => t.tournamentID % 4 === 0));

    const TournamentList = tourns.map((t: TournamentType, index) => <Tournament
      data={t}
      register={this.register}
      unregister={this.unregister}
      authenticated
      registeredInTournament={index % 2 === 10}
    />);

    const richest = tourns
      .filter(t => !isNaN(t.Prizes[0]))
      .sort((a: TournamentType, b: TournamentType) => b.Prizes[0] - a.Prizes[0])
      .slice(0, 3);

    const RichestList = this.filter(richest, () => true);
    // <div className="row">{TournamentList}</div>
    const auth = login ? '' : <a href="/Login" className="btn btn-success">Авторизуйтесь, чтобы сыграть!</a>;
    return (
      <div>
        {auth}
        <h2 className="page">Сегодня</h2>
        <div className="row">{TodayTournaments}</div>

        <h2 className="page">Завтра</h2>
        <div className="row">{TomorrowTournaments}</div>

        <h2 className="page">Турниры с наибольшими призами</h2>
        <div className="row">{RichestList}</div>

        <hr colour="white" width="60%" align="center" />
      </div>);
  }
}
