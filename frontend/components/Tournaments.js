/**
 * Created by gaginho on 04.06.16.
 */
import { h, Component } from 'preact';
import request from 'superagent';
import { isToday, isTomorrow } from '../helpers/date';

import Tournament from './Tournaments/tournament';

type TournamentType = {
  buyIn: number,
  tournamentID: number,
  gameNameID: number,
  status: number,
  Prizes: Array<number>,
};

type StateType = {
  tournaments: Array<TournamentType>,
};

type ProfileData = {
  tournaments: Object,
}

type ResponseType = {
  body: {
    profile: ProfileData,
    err: Object,
  }
};

export default class Tournaments extends Component {
  state = {
    tournaments: {},
    registeredIn: {},
    options: {},
  };

  componentWillMount() {
    request
      .get('/myprofile')
      .end((err, res) => {
        if (err) throw err;
        if (res.body.err) throw res.body.err;

        const tRegs: Array = res.body.profile.tournaments;

        const registeredIn = {};
        tRegs.forEach(reg => { registeredIn[reg.tournamentID] = 1; });

        this.setState({ registeredIn });
      });
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

    const TodayTournaments = this
      .filter(tourns, (t: TournamentType) => t.startDate && isToday(t.startDate));

    const TomorrowTournaments = this
      .filter(tourns, (t: TournamentType) => t.startDate && isTomorrow(t.startDate));

    const FreeTournaments = this
      .filter(tourns, (t: TournamentType) => t.buyIn === 0);


    const richest = tourns
      .filter(t => !isNaN(t.Prizes[0]))
      .sort((a: TournamentType, b: TournamentType) => b.Prizes[0] - a.Prizes[0])
      .slice(0, 3);

    const RichestList = this.filter(richest, () => true);
    // <div className="row">{TournamentList}</div>
    const auth = login ? '' : <a href="/Login" className="btn btn-success">Авторизуйтесь, чтобы сыграть!</a>;
    /*

     <h2 className="page">Бесплатные</h2>
     <div className="row killPaddings nomargins">{FreeTournaments}</div>

     <h2 className="page">Турниры с наибольшими призами</h2>
     <div className="row killPaddings nomargins">{RichestList}</div>
     */
    return (
      <div>
        {auth}
        <h2 className="page">{isToday(new Date(), 1)}</h2>

        <h2 className="page">Пройдут сегодня</h2>
        <div className="row killPaddings nomargins">{TodayTournaments}</div>

        <h2 className="page">Пройдут завтра</h2>
        <div className="row killPaddings nomargins">{TomorrowTournaments}</div>

        <hr colour="white" width="60%" align="center" />
      </div>
    );
  }
}
