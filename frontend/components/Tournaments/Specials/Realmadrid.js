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

    const round1 = this.roundTab('Раунд 1', 'БЕСПЛАТНО', 'Призы: 200 билетов на раунд 2', 'Пятница, 21:00 (МСК)', () => {});
    const round2 = this.roundTab('Раунд 2', 'Стоимость участия: 5 РУБ', 'Призы: 30 билетов на раунд 3', 'Суббота, 21:00 (МСК)', () => {});
    const round3 = this.roundTab('Раунд 3', 'Стоимость участия: 30 РУБ', 'Призы: 10 билетов на раунд 4', 'Воскресенье, 21:00 (МСК)', () => {});
    const round4 = this.roundTab('Раунд 4', 'Стоимость участия: 80 РУБ', 'Призы: 4 билета в финал', 'Понедельник, 21:00 (МСК)', () => {});
    const round5 = this.roundTab('ФИНАЛ', 'Стоимость участия: 150 РУБ', 'Приз: Футболка Реал Мадрид 2016/2017', 'Вторник, 21:00 (МСК)', () => {});

    return (
      <div>
        <div className="center height-fix">
          <h2 className="content-title">Турнир Мадридиста</h2>
          <div className="text-big">Всего 5 шагов отделяет тебя от награды!</div>
          <div className="rma-cover">
            <div className="rma-cover-img hide"></div>
            {round1}
            {round2}
            {round3}
            {round4}
            {round5}
          </div>
        </div>
      </div>
    );
  }
}
