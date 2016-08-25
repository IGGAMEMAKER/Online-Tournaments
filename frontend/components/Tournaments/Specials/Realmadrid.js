import { h, Component } from 'preact';
import Button from '../../../components/Shared/Button';

import actions from '../../../actions/ProfileActions';
import store from '../../../stores/ProfileStore';
type PropsType = {}

type StateType = {}

export default class Realmadrid extends Component {
  state = {};

  componentWillMount() {}

  roundTab = (num, price, prizes, time, onRegister) => {
    return (
      <div>
        <div className="round-number">{num}</div>
        <div className="round-container">
          <div className="round-image"></div>
          <div className="round-tournament-info">
            <div className="round-upper">
              <div className="round-date-time">{time}</div>
              <div className="round-prize">{prizes}</div>
              <div className="round-price">{price}</div>
              <div className="round-join">
                <Button onClick={onRegister} text="Участвовать" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render(props: PropsType, state: StateType) {

    const round1 = this.roundTab('Раунд 3', 'БЕСПЛАТНО', 'Призы: 200 билетов на раунд 2', 'Пятница, 21:00 (МСК)', () => {});
    const round2 = this.roundTab('Раунд 2', 'Стоимость участия: 5р', 'Призы: 30 билетов на раунд 1', 'Суббота, 21:00 (МСК)', () => {});
    const round3 = this.roundTab('Раунд 1', 'Стоимость участия: 30р', 'Призы: 10 билетов в финал', 'Воскресенье, 21:00 (МСК)', () => {});
    const round4 = this.roundTab('ФИНАЛ', 'Стоимость участия: 80р', 'Приз: Футболка Реал Мадрид 2016/2017!', 'Понедельник, 21:00 (МСК)', () => {});
    // const round5 = this.roundTab('ФИНАЛ', 'Стоимость участия: 150р', 'Приз: Футболка Реал Мадрид 2016/2017', 'Вторник, 21:00 (МСК)', () => {});

    // <div className="text-big">Всего 4 шага отделяет тебя от награды!</div>
    return (
      <div>
        <div className="center height-fix">
          <h2 className="content-title">Турнир Мадридиста</h2>
          <div className="rma-cover">
            <div className="rma-cover-img hide"></div>
            <div className="round-title-text">Победи в финале и мы пришлём футболку Реала</div>
            {round4}
            {round3}
            {round2}
            {round1}
          </div>
        </div>
      </div>
    );
  }
}
