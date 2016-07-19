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
  selected: number,
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
    tournaments: TOURNAMENTS,
    registeredIn: {},
    options: {},
    value: store.getTestValue(),
    selected: 0,
  };

  componentWillMount() {
    // const tourns: Array<TournamentType> = TOURNAMENTS;
    store.addChangeListener(() => {
      this.setState({
        money: store.getMoney(),
        value: store.getTestValue(),
        registeredIn: store.getMyTournaments(),
        tournaments: store.getAvailableTournaments(),
      });
    });

    actions.updateTournaments(TOURNAMENTS);
    actions.initialize();
  }

  register = (tournamentID, buyIn) => {
    actions.register(tournamentID, buyIn);
  };

  unregister = (tournamentID) => {
    actions.unregister(tournamentID);
  };

  onSelected = (id) => {
    this.setState({
      selected: this.state.selected === id ? 0 : id
    });
  };

  filter = (tournaments, filterFunction, group) => {
    const registeredIn = this.state.registeredIn || {};

    const list = tournaments
      .filter(filterFunction)
      .map(t =>
        <Tournament
          data={t}
          register={this.register}
          unregister={this.unregister}
          authenticated
          registeredInTournament={registeredIn[t.tournamentID]}
          onSelected={this.onSelected}
          isSelected={this.state.selected === t.tournamentID}
        />
      );

    if (!list.length) {
      return '';
    }

    if (group) {
      // <hr colour="white" width="30%" align="center" />
      return (
        <div>
          <h2 className="page">{group}</h2>
          <div className="row nomargins">{list}</div>
        </div>
      );
      // killPaddings nomargins
    }

    return list;
  };

  render(props: PropsType, state: StateType) {
    // const state: StateType = this.state;
    // const tourns: Array<TournamentType> = TOURNAMENTS;

    // console.log('render TOURNAMENTS');
    // console.log(TOURNAMENTS);
    // console.log(state.tournaments);
    const tourns: Array<TournamentType> = state.tournaments;
    const REGULARITY_REGULAR = 1;

    const todayF = (t: TournamentType) => t.startDate && isToday(t.startDate);
    const tommorrowF = (t: TournamentType) => t.startDate && isTomorrow(t.startDate);
    const regularF = (t: TournamentType) =>
    t.settings && t.settings.regularity === REGULARITY_REGULAR;
    const freeF = (t: TournamentType) => t.buyIn === 0;
    const streamF = (t: TournamentType) => t.settings.regularity === 2;

    const richest = tourns
      .filter(t => !isNaN(t.Prizes[0]))
      .sort((a: TournamentType, b: TournamentType) => b.Prizes[0] - a.Prizes[0])
      .slice(0, 3);

    // const all = this.filter(tourns, () => true, 'Все турниры');
    const TodayTournaments = this.filter(tourns, todayF, 'Пройдут сегодня');
    const TomorrowTournaments = this.filter(tourns, tommorrowF, 'Пройдут завтра');
    const RegularTournaments = this.filter(tourns, regularF, 'Регулярные турниры');
    // const FreeTournaments = this.filter(tourns, freeF, 'Бесплатные турниры');
    // const StreamTournaments = this.filter(tourns, streamF);
    const RichestTournaments = (
      <div id="top">
        {this.filter(richest, () => true, 'ТОП турниры')}
      </div>
    );

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
    const authButton = (
      <a
        href="/Login"
        className="btn btn-success"
        style={{ display: login ? 'none' : 'block' }}
      >Авторизуйтесь, чтобы сыграть!</a>
    );

    /*


     <hr colour="white" width="60%" align="center" />
     */

    return (
      <div>
        {authButton}

        {RegularTournaments}

        {TodayTournaments}

        {TomorrowTournaments}

        {RichestTournaments}
      </div>
    );
  }
}
