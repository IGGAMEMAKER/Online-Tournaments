import { h, Component } from 'preact';
import {
  PRIZE_TYPE_MONEY,
  PRIZE_TYPE_GIFT,
  PRIZE_TYPE_POINTS,
  PRIZE_TYPE_TICKETS
} from '../../constants/constants';

import Button from '../Shared/Button';

type PropsType = {}

type PrizeType = {
  type: number,
  info: Object
}

type StateType = {
  Prizes: Array<PrizeType>,

  current: number
}

export default class TournamentPrizeGenerator extends Component {
  render(props: PropsType, state: StateType) {
    let input;

    switch (state.current) {
      case PRIZE_TYPE_GIFT:
        input = <input type="text" value={0} />;
        break;
      case PRIZE_TYPE_MONEY:
        input = <input type="number" value={0} />;
        break;
      case PRIZE_TYPE_POINTS:
        input = <input type="number" value={100} />;
        break;
      case PRIZE_TYPE_TICKETS:
        input = <input type="number" value={0} />;
        break;
    }

    return (
      <div>
        <div>TournamentPrizeGenerator</div>
        <select value={state.current}>
          <option value={PRIZE_TYPE_MONEY}>money</option>
          <option value={PRIZE_TYPE_GIFT}>Gift</option>
          <option value={PRIZE_TYPE_POINTS}>Points</option>
          <option value={PRIZE_TYPE_TICKETS}>Tickets</option>
        </select>

        {input}

        <br />
        <br />
        <button onClick={() => {}}>Add gift</button>
        <div></div>
      </div>
    );
  }
}
