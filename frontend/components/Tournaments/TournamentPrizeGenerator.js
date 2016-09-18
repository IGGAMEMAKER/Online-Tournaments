import { h, Component } from 'preact';
import {
  PRIZE_TYPE_MONEY,
  PRIZE_TYPE_GIFT,
  PRIZE_TYPE_POINTS,
  PRIZE_TYPE_TICKETS
} from '../../constants/constants';

import GiftSelector from '../../components/Gifts/GiftSelector';

type PropsType = {
  copyGeneratedPrizeToAddingForm: Function
}

type PrizeType = {
  type: number,
  info: Object
}

type StateType = {
  Prizes: Array<PrizeType>,

  currentPrizeType: number
}

export default class TournamentPrizeGenerator extends Component {
  state = {
    currentPrizeType: PRIZE_TYPE_MONEY,

    Prizes: []
  };

  onChangeCurrentPrizeType = (e: KeyboardEvent) => {
    const currentPrizeType = parseInt(e.target.value);

    this.setState({ currentPrizeType });
  };

  addPrizeToList = () => {
    const { Prizes } = this.state;
    const prizeType = this.state.currentPrizeType;

    const value = document.getElementById('data').value;
    let info = value;

    if (prizeType === PRIZE_TYPE_MONEY || prizeType === PRIZE_TYPE_POINTS || prizeType === PRIZE_TYPE_TICKETS) {
      info = parseInt(value, 10);
    }

    Prizes.push({ type: prizeType, info });
    this.setState({ Prizes })
  };

  render(props: PropsType, state: StateType) {
    let inputType = "number", value = 0;
    let helper;

    switch (state.currentPrizeType) {
      case PRIZE_TYPE_MONEY:
        break;
      case PRIZE_TYPE_GIFT:
        inputType = "text";
        helper = <GiftSelector items={{}} />;
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
        {helper}
        <br />
        <br />
        <select value={state.currentPrizeType} onChange={this.onChangeCurrentPrizeType}>
          <option value={PRIZE_TYPE_MONEY}>money</option>
          <option value={PRIZE_TYPE_GIFT}>Gift</option>
          <option value={PRIZE_TYPE_POINTS}>Points</option>
          <option value={PRIZE_TYPE_TICKETS}>Tickets</option>
        </select>
        <br />

        <input type={inputType} id="data" value={value} style="width: 300px;" />

        <br />
        <br />
        <button onClick={this.addPrizeToList}>Add prize</button>
        <div></div>
        <br />
        <br />
        <div>Total</div>
        <input type="text" value={JSON.stringify(this.state.Prizes)} style="width: 300px;" />

        <button onClick={() => { props.copyGeneratedPrizeToAddingForm(state.Prizes) }}>Copy Prize to form</button>
      </div>
    );
  }
}
