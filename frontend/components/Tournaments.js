/**
 * Created by gaginho on 04.06.16.
 */
import { h, Component } from 'preact';
import request from 'superagent';
import { isToday, isTomorrow } from '../helpers/date';
import { TournamentType } from './types';
import ModalContainer from '../components/Modal/ModalContainer';
import TestComponent from '../components/TestComponents/Comp1';

import Chat from './Activity/Chat';

import Tournament from './Tournaments/tournament';
import socketListener from '../helpers/SocketListener';

import store from '../stores/ProfileStore';
import actions from '../actions/ProfileActions';

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
    value: store.getTestValue(),
  };

  componentWillMount() {
    store.addChangeListener(() => {
      this.setState({
        registeredIn: store.getMyTournaments(),
        money: store.getMoney(),
        value: store.getTestValue(),
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

    const all = this
      .filter(tourns, () => true);
    const TodayTournaments = this
      .filter(tourns, (t: TournamentType) => t.startDate && isToday(t.startDate));

    const TomorrowTournaments = this
      .filter(tourns, (t: TournamentType) => t.startDate && isTomorrow(t.startDate));

    const FreeTournaments = this
      .filter(tourns, (t: TournamentType) => t.buyIn === 0);

    const StreamTournaments = this
      .filter(tourns, (t: TournamentType) => t.settings.regularity === 2);

    const richest = tourns
      .filter(t => !isNaN(t.Prizes[0]))
      .sort((a: TournamentType, b: TournamentType) => b.Prizes[0] - a.Prizes[0])
      .slice(0, 3);

    /*
    const RichestList = this.filter(richest, () => true);
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
    return (
      <div>
        <ModalContainer />
        <a
          href="/Login"
          className="btn btn-success"
          style={{
            display: login ? 'none' : 'block'
          }}
        >Авторизуйтесь, чтобы сыграть!</a>

        <h2 className="page">Стримовые</h2>
        <div className="row killPaddings nomargins">{StreamTournaments}</div>

        <h2 className="page">Пройдут сегодня</h2>
        <div className="row killPaddings nomargins">{TodayTournaments}</div>

        <h2 className="page">Пройдут завтра</h2>
        <div className="row killPaddings nomargins">{TomorrowTournaments}</div>

        <h2 className="page">Бесплатные турниры</h2>
        <div className="row killPaddings nomargins">{FreeTournaments}</div>

        <hr colour="white" width="60%" align="center" />
        <Chat />
      </div>
    );
  }
}
