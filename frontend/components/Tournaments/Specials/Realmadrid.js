import { h, Component } from 'preact';
import Button from '../../Shared/Button';
// import Tournament from '../../Tournaments/tournament';

import TournamentTypeChecker from '../../../helpers/tournamentTypeChecker';

import actions from '../../../actions/ProfileActions';
import store from '../../../stores/ProfileStore';
type PropsType = {}

type StateType = {
  tournaments: Array
}

export default class Realmadrid extends Component {
  state = {
    tournaments: []
  };

  componentWillMount() {
    store.addChangeListener(() => {
      this.setState({
        tournaments: store.getAvailableTournaments(),
      })
    })
  }

  roundTab = (num, price, prizes, time, players, tournamentID) => {
    return (
      <div>
        <div className="round-number">{num > 0 ? `Раунд ${num}` : 'Финал'}</div>
        <div className="round-container">
          <div className="round-image"></div>
          <div className="round-tournament-info">
            <div className="round-upper">
              <div className="round-date-time">{time}</div>
              <div className="round-prize">{prizes}</div>
              <div className="round-prize">Игроков: {players}</div>
              <div className="round-price">{price}</div>
              <div className="round-join">
                {this.getRegisterIndicator(tournamentID)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  getRegisterIndicator = (id) => {
    if (id === 0) {
      // return  <button disabled className="btn btn-block">Набор участников <br/> закрыт</button>
      return  <button disabled className="btn btn-block">Турнир завершён</button>
    }

    if (store.isRegisteredIn(id)) {
      return <div className="white">^ Вы участвуете</div>
    }

    return <Button onClick={() => { actions.register(id)}} text="Участвовать" />
  };

  onRegister = (tournamentID) => {

  };

  render(props: PropsType, state: StateType) {
    const list = state.tournaments;
    const r1Ts = list.filter(t => TournamentTypeChecker.isRmaRound(t, 3));
    const r2Ts = list.filter(t => TournamentTypeChecker.isRmaRound(t, 2));
    const r3Ts = list.filter(t => TournamentTypeChecker.isRmaRound(t, 1));
    const finalList = list.filter(t => TournamentTypeChecker.isRmaFinal(t));


    const r1ID = r1Ts.length? r1Ts[0].tournamentID: 0;
    const r2ID = r2Ts.length? r2Ts[0].tournamentID: 0;
    const r3ID = r3Ts.length? r3Ts[0].tournamentID: 0;
    const finalID = finalList.length? finalList[0].tournamentID: 0;

    const round1 = this.roundTab(3, 'БЕСПЛАТНО', 'Призы: 200 билетов на раунд 2', 'Пятница, 21:00 (МСК)', 858, r1ID);
    const round2 = this.roundTab(2, 'Стоимость участия: 5р', 'Призы: 30 билетов на раунд 1', 'Суббота, 21:00 (МСК)', 232, r2ID);
    const round3 = this.roundTab(1, 'Стоимость участия: 30р', 'Призы: 10 билетов в финал', 'Воскресенье, 21:00 (МСК)', 10, r3ID);
    // const round4 = this.roundTab('ФИНАЛ', '', '', '', () => {});
    // const round4 = this.roundTab('ФИНАЛ', 'Стоимость участия: 80р', 'Приз: Футболка Реал Мадрид 2016/2017!', 'Понедельник, 21:00 (МСК)', () => {});
    // const round5 = this.roundTab('ФИНАЛ', 'Стоимость участия: 150р', 'Приз: Футболка Реал Мадрид 2016/2017', 'Вторник, 21:00 (МСК)', () => {});

    // <div className="text-big">Всего 4 шага отделяет тебя от награды!</div>
    return (
      <div>
        <div className="center height-fix">
          <h2 className="content-title">Турнир Мадридиста</h2>
          <div className="rma-cover">
            <div className="rma-cover-img hide"></div>
            <div className="round-title-text">Победи в финале и мы пришлём футболку Реала</div>

            <div>
              <div className="round-number">Финал</div>
              <div className="round-container">
                <div className="round-image"></div>
                <div className="round-tournament-info">
                  <div className="round-upper">
                    <div className="round-date-time">Понедельник, 21:00 (МСК)</div>
                    <div className="round-prize">Приз: Футболка Реал Мадрид 2016/2017!</div>
                    <div className="round-price">Стоимость участия: 80р</div>
                    <div className="round-join">
                      {this.getRegisterIndicator(finalID)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          {round3}
          {round2}
          {round1}
        </div>
      </div>
    );
  }
}
