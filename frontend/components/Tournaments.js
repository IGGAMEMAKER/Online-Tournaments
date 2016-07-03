/**
 * Created by gaginho on 04.06.16.
 */
import { h, Component } from 'preact';
import { isToday, isTomorrow } from '../helpers/date';
import { TournamentType } from './types';

import Tournament from './Tournaments/tournament';

import store from '../stores/ProfileStore';
import actions from '../actions/ProfileActions';

type StateType = {
  tournaments: Array<TournamentType>,
};

type PropsType = {};

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
    tournaments: [],
    registeredIn: {},
    options: {},
    value: store.getTestValue(),
  };

  componentWillMount() {
    // const tourns: Array<TournamentType> = TOURNAMENTS;
    this.setState({
      tournaments: TOURNAMENTS,
    });

    store.addChangeListener(() => {
      this.setState({
        registeredIn: store.getMyTournaments(),
        money: store.getMoney(),
        value: store.getTestValue(),
        // tournaments: store.getAvailableTournaments(),
      });
    });

    actions.initialize();
  }

  register = (tournamentID) => {
    actions.register(tournamentID);
  };

  unregister = (tournamentID) => {
    actions.unregister(tournamentID);
  };

  filter = (tournaments, filterFunction) => {
    const registeredIn = this.state.registeredIn || {};
    return tournaments
      .filter(filterFunction)
      .map(t =>
        <Tournament
          data={t}
          register={this.register}
          unregister={this.unregister}
          authenticated
          registeredInTournament={registeredIn[t.tournamentID]}
        />
      );
  };

  render(props: PropsType, state: StateType) {
    // const state: StateType = this.state;
    // const tourns: Array<TournamentType> = TOURNAMENTS;
    // console.log('render TOURNAMENTS');
    // console.log(TOURNAMENTS);
    // console.log(state.tournaments);
    const tourns: Array<TournamentType> = state.tournaments;

    const all = this
      .filter(tourns, () => true);
    const TodayTournaments = this
      .filter(tourns, (t: TournamentType) => t.startDate && isToday(t.startDate));

    const TomorrowTournaments = this
      .filter(tourns, (t: TournamentType) => t.startDate && isTomorrow(t.startDate));

    const REGULARITY_REGULAR = 1;
    const RegularList = this
      .filter(tourns, (t: TournamentType) =>
      t.settings && t.settings.regularity === REGULARITY_REGULAR);

    const FreeTournaments = this
      .filter(tourns, (t: TournamentType) => t.buyIn === 0);

    const StreamTournaments = this
      .filter(tourns, (t: TournamentType) => t.settings.regularity === 2);

    const richest = tourns
      .filter(t => !isNaN(t.Prizes[0]))
      .sort((a: TournamentType, b: TournamentType) => b.Prizes[0] - a.Prizes[0])
      .slice(0, 3);

    const RichestList = this.filter(richest, () => true);
    /*
    // <div className="row">{TournamentList}</div>

     <h2 className="page">Бесплатные</h2>
     <div className="row killPaddings nomargins">{FreeTournaments}</div>

     <h2 className="page">Турниры с наибольшими призами</h2>
     <div className="row killPaddings nomargins">{RichestList}</div>
     */
    // const auth = login ? '' : <a href="/Login" className="btn btn-success">Авторизуйтесь, чтобы сыграть!</a>;
    /*
     <Modal show>
     <Modal.Header closeButton>
     <Modal.Title>Modal heading</Modal.Title>
     </Modal.Header>
     <Modal.Body>
     <h4>Text in a modal</h4>
     </Modal.Body>
     <Modal.Footer>
     <button onClick={this.close}>Close</button>
     </Modal.Footer>
     </Modal>
        <h2 className="page">all</h2>
        <div className="row killPaddings nomargins">{all}</div>
     */
    //     <TestComponent />
    //         <h2 className="page">Стримовые</h2>
    // <div className="row killPaddings nomargins">{StreamTournaments}</div>

    // <h2 className="page">Бесплатные турниры</h2>
    // <div className="row killPaddings nomargins">{FreeTournaments}</div>

    // if (!tourns.length) {
    //   return <h1>AZAZAZA</h1>;
    // }
    return (
      <div>
        <a
          href="/Login"
          className="btn btn-success"
          style={{ display: login ? 'none' : 'block' }}
        >Авторизуйтесь, чтобы сыграть!</a>

        <h2 className="page">Регулярные турниры</h2>
        <div className="row killPaddings nomargins">{RegularList}</div>

        <h2 className="page">Пройдут сегодня</h2>
        <div className="row killPaddings nomargins">{TodayTournaments}</div>

        <h2 className="page">Пройдут завтра</h2>
        <div className="row killPaddings nomargins">{TomorrowTournaments}</div>

        <h2 className="page">Турниры с наибольшими призами</h2>
        <div className="row killPaddings nomargins">{RichestList}</div>

        <hr colour="white" width="60%" align="center" />
      </div>
    );
  }
}
