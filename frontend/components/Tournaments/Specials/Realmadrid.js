import { h, Component } from 'preact';
import Button from '../../../components/Shared/Button';

import actions from '../../../actions/ProfileActions';
import store from '../../../stores/ProfileStore';
type PropsType = {}

type StateType = {}

type ResponseType = {}

export default class StdClass extends Component {
  state = {};

  componentWillMount() {}

  roundTab = (num, price, prizes, time, onRegister) => {
    return (
      <div className="round-container">
        <div className="round-image"></div>
        <div className="round-tournament-info">
          <div className="round-upper">
            <div className="round-number">Раунд {num}</div>
            <div className="round-price">{price}</div>
          </div>
          <div className="round-date-time">{time}</div>
          <div className="round-prize">{prizes}</div>
          <div className="round-join">
            <Button onClick={onRegister} text="Участвовать" />
          </div>
        </div>
      </div>
    );
  };

  render(props: PropsType, state: StateType) {

    const round1 = this.roundTab(5, 'Бесплатно', 'Призы: 200 билетов на раунд 4', 'Пятница, 21:00 по МСК', () => {});
    const round2 = this.roundTab(4, '5 РУБ', 'Призы: 30 билетов на раунд 3', 'Суббота, 21:00 по МСК', () => {});
    const round3 = this.roundTab(3, '30 РУБ', 'Призы: 10 билетов на раунд 2', 'Воскресенье, 21:00 по МСК', () => {});
    const round4 = this.roundTab(2, '80 РУБ', 'Призы: 4 билета в финал', 'Понедельник, 20:00 по МСК', () => {});
    const round5 = this.roundTab(1, '150 РУБ', 'Приз: Футболка Реал Мадрид 2016/2017', 'Понедельник, 21:30 по МСК', () => {});

    return (
      <div>
        <div className="center height-fix">
          <h2 className="content-title">Турнир Мадридиста</h2>
          <div className="text-big">Всего 5 шагов отделяет тебя от награды!</div>
          <div className="rma-cover">
            <div className="rma-cover-img"></div>
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
