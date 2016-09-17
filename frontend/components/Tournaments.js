/**
 * Created by gaginho on 04.06.16.
 */
import { h, Component } from 'preact';
import { isToday, isTomorrow } from '../helpers/date';
import constants from '../constants/constants';
import { TournamentType } from './types';

import tournamentTypeChecker from '../helpers/tournamentTypeChecker';

import Tournament from './Tournaments/tournament';

import store from '../stores/ProfileStore';
import actions from '../actions/ProfileActions';

type StateType = {
  tournaments: Array<TournamentType>,
  selected: number,
};

type PropsType = {
  filter: number,
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
    tournaments: [],
    registeredIn: {},
    options: {},
    value: store.getTestValue(),
    selected: 0
  };

  componentWillMount() {
    // const tourns: Array<TournamentType> = TOURNAMENTS;
    store.addChangeListener(() => {
      this.setState({
        money: store.getMoney(),
        value: store.getTestValue(),
        registeredIn: store.getMyTournaments(),
        tournaments: store.getAvailableTournaments()
      });
    });

    actions.updateTournaments([]);
    // actions.initialize();
  }

  // componentWillMount() {
  //   console.log('componentWillMount tournaments');
  // }

  componentDidMount() {
    console.log('componentDidMount tournaments');
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentDidUpdate() {
    console.log('componentDidUpdate tournaments');
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
    const tourns: Array<TournamentType> = state.tournaments;

    const todayF = tournamentTypeChecker.willRunToday;
    const tommorrowF = tournamentTypeChecker.willRunTomorrow;
    const regularF = tournamentTypeChecker.isRegularTournament;

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
        {this.filter(richest, () => true, 'Крупнейшие призы')}
      </div>
    );

    const frees = this.filter(tourns, tournamentTypeChecker.isFreeTournament, 'Бесплатные турниры');
    const elites = this.filter(tourns, tournamentTypeChecker.isEliteTournament, 'Элитные турниры');
    const crowds = this.filter(tourns, tournamentTypeChecker.isCrowdTournament, 'Большие турниры');

    /*
    // <div className="row">{TournamentList}</div>

     <h2 className="page">Бесплатные</h2>
     <div className="row killPaddings nomargins">{FreeTournaments}</div>

     <h2 className="page">Турниры с наибольшими призами</h2>
     <div className="row killPaddings nomargins">{RichestList}</div>
     */
    // const auth = login ? '' : <a href="/Login" className="btn btn-success">Авторизуйтесь, чтобы сыграть!</a>;
    //     <TestComponent />
    //         <h2 className="page">Стримовые</h2>
    // <div className="row killPaddings nomargins">{StreamTournaments}</div>

    // <h2 className="page">Бесплатные турниры</h2>
    // <div className="row killPaddings nomargins">{FreeTournaments}</div>

    const authButton = (
      <a
        href="/Login"
        className="btn btn-success"
        style={{ display: login ? 'none' : 'block' }}
      >Авторизуйтесь, чтобы сыграть!</a>
    );


    // <hr colour="white" width="60%" align="center" />

    let tournaments;

    if (!props.filter) {
      tournaments = (
        <div>
          {TodayTournaments}

          {TomorrowTournaments}

          {frees}
          {elites}
          {crowds}

          {RegularTournaments}


          {RichestTournaments}
        </div>
      );
    }

    if (props.filter === constants.TOURNAMENT_FILTER_FREE) {
      tournaments = <div>{frees}</div>;
    }

    if (props.filter === constants.TOURNAMENT_FILTER_ELITE) {
      tournaments = <div>{elites}</div>;
    }

    if (props.filter === constants.TOURNAMENT_FILTER_CROWD) {
      tournaments = <div>{crowds}</div>;
    }

    // {authButton}
    return (
      <div>
        {tournaments}
        <br />
      </div>
    );
  }
}
