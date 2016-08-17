import { h, Component } from 'preact';
import {
  PRIZE_TYPE_MONEY,
  PRIZE_TYPE_GIFT,
  PRIZE_TYPE_POINTS,
  PRIZE_TYPE_TICKETS
} from '../../constants/constants';

import GiftSelector from '../../components/Gifts/GiftSelector';

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
  state = {
    current: PRIZE_TYPE_MONEY,

    Prizes: []
  };

  onChangeCurrentPrizeType = (e: KeyboardEvent) => {
    const current = parseInt(e.target.value);
    console.log('onChangeCurrentPrizeType', current);

    this.setState({ current });
  };

  addGiftToList = () => {
    const { Prizes } = this.state;

    Prizes.push({
      type: this.state.current,
      info: document.getElementById('data').value
    });

    this.setState({
      Prizes
    })
  };

  render(props: PropsType, state: StateType) {
    let inputType = "number", value = 0;

    switch (state.current) {
      case PRIZE_TYPE_MONEY:
        break;
      case PRIZE_TYPE_GIFT:
        inputType = "text";
        break;
      case PRIZE_TYPE_POINTS:
        value = 100;
        break;
      case PRIZE_TYPE_TICKETS:
        break;
      default:
        value = 122220;
        break;
    }

    return (
      <div>
        <div>TournamentPrizeGenerator</div>
        <GiftSelector items={{}} />
        <select value={state.current} onChange={this.onChangeCurrentPrizeType}>
          <option value={PRIZE_TYPE_MONEY}>money</option>
          <option value={PRIZE_TYPE_GIFT}>Gift</option>
          <option value={PRIZE_TYPE_POINTS}>Points</option>
          <option value={PRIZE_TYPE_TICKETS}>Tickets</option>
        </select>

        <input type={inputType} id="data" value={value} style="width: 300px;" />

        <br />
        <br />
        <button onClick={this.addGiftToList}>Add prize</button>
        <div></div>
        <br />
        <br />
        <div>Total</div>
        <input type="text" value={JSON.stringify(this.state.Prizes)} style="width: 300px;" />
      </div>
    );
  }
}
