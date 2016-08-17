import { h, Component } from 'preact';
import InfoStore from '../../stores/InfoStore';
import actions from '../../actions/InfoActions';

type PropsType = {
  items: Array
}

type StateType = {}

export default class GiftSelector extends Component {
  state = {
    gifts: [],
    items: {}
  };

  attachGift = (i) => {
    const state: StateType = this.state;
    let items = Object.assign({}, state.items);

    if (items[i]) {
      items[i] = 0;
    } else {
      items[i] = 1;
    }

    this.setState({ items });
  };

  isAttached = (i) => {
    return this.state.items[i];
  };

  componentWillMount() {
    console.log('componentWillMount giftSelector');

    InfoStore.addChangeListener(() => {
      console.log('gifts in giftSelector', InfoStore.getGifts());

      this.setState({
        gifts: InfoStore.getGifts()
      })
    });

    this.setState({
      items: this.props.items
      // gifts: InfoStore.getGifts()
    });

    actions.getGifts();
  }

  componentWillReceiveProps() {
    this.setState({
      items: this.props.items
    });
  }

  render(props: PropsType, state: StateType) {
    const giftSelector = state.gifts.map((g, i) => {
      return (
        <div
          onClick={() => this.attachGift(i)}
          className={this.isAttached(i) ? 'red' : ''}>
          {g.name}
          {this.isAttached(i) ? '  X' : ''}
        </div>
      );
    });

    const selectedList = state.gifts.filter((g, i) => this.isAttached(i)).map(g => `"${g._id}"`);

    return (
      <div>
        <button onClick={() => { this.setState({ items: {} }) }}>clear</button>
        <div>
          <h3>Gift selector</h3>
          {giftSelector}
        </div>
        <input value={`[${selectedList}]`} className="black full" style="width: 400px;"/>
        <br />
        <label>test</label>
      </div>
    );
  }
}
