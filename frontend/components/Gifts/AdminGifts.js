import { h, Component } from 'preact';
import actions from '../../actions/AdminActions';
import store from '../../stores/AdminStore';

import PackPrize from '../../components/Packs/PackPrize';
import GiftForm from '../../components/Packs/GiftForm';

type Gift = {

}

type StateType = {
  gifts: Array<Gift>,

  newGift: Gift,
  items: Object,
}

const VIEWS_IMAGED = 'VIEWS_IMAGED';
const VIEWS_TABLE = 'VIEWS_TABLE';

const getEmptyGift = () => {
  return {
    description: '',
    name: '',
    properties: {},
    photoURL: '',
    price: 0
  };
};

export default class AdminGifts extends Component {
  state = {
    gifts: [],
    packs: [],
    view: VIEWS_IMAGED,

    newGift: getEmptyGift(),
    items: {}
  };

  componentWillMount() {
    store.addChangeListener(() => {
      this.setState({
        gifts: store.getGifts()
      })
    });

    actions.getGifts();
  }

  addGift = (gift) => {
    actions.addGift(gift);

    this.setState({
      gift: getEmptyGift()
    })
  };

  onChangeNewGift = (newGift) => {
    this.setState({ newGift })
  };

  editGift = (i) => {
    return (gift) => {
      let gifts = this.state.gifts;
      gifts[i] = Object.assign({}, gifts[i], gift);

      setTimeout(() => {
        this.setState({ gifts });
      }, 100);
    }
  };

  saveGiftChanges = (i) => {
    const gift = this.state.gifts[i];
    // console.log('saveGiftChanges', gift);
    actions.editGift(gift);
  };

  removeGift = (i) => {
    actions.removeGift(this.state.gifts[i]._id);
  };

  getGiftIndexByGiftID = (giftID) => {
    let index = -1;

    this.state.gifts.forEach((g, i) => {
      if (giftID === g._id) {
        index = i;
      }
    });

    return index;
  };

  drawGiftCardTexted = (i) => {
    const g = this.state.gifts[i];
    // return <div>{g.name}</div>;
    return g.name;
  };

  getGiftByGiftID = (giftID) => {
    let gift = null;

    this.state.gifts.forEach(g => {
      if (g._id === giftID) {
        gift = g;
      }
    });

    return gift;
  };

  countableGift = (index) => {
    let gift = this.state.gifts[index];
    try {
      return gift.properties.isCard ? 0 : this.state.gifts[index].price;
    } catch (e) {
      console.error(e, 'countableGift', index, gift, this.state.gifts);
      return 0;
    }
  };

  render(props, state: StateType) {
    const giftData = state.gifts.map((g, i) => {
      return (
        <div>
          <div>
            <div className="col-sm-2">
              <div className="white">{g._id}</div>
              <GiftForm
                onSubmit={() => { this.saveGiftChanges(i); }}
                onChange={this.editGift(i)}
                gift={g}
                action="edit gift"
                removable
                onRemove={() => { this.removeGift(i); }}
              />
            </div>
            <div className="col-sm-2">
              <PackPrize
                src={g.photoURL}
                name={g.name}
                description={g.description}
              />
            </div>
          </div>
        </div>
      );
    });

    // console.log('gifts', state.gifts);
    const g = state.newGift;

    return (
      <div>
        <div className="height-fix">
          <h2 className="white">Все карточки</h2>
          {giftData}
        </div>

        <div className="height-fix">
          <center>
            <div className="col-sm-4">
              <h2 className="white">Добавление новой карточки</h2>
              <GiftForm
                onSubmit={this.addGift}
                onChange={this.onChangeNewGift}
                gift={state.newGift}
                action="add gift"
              />
            </div>
            <div className="col-sm-4">
              <br />
              <br />
              <br />
              <br />
              <PackPrize
                src={g.photoURL}
                name={g.name}
                description={g.description}
              />
            </div>
          </center>
        </div>
      </div>
    );
  }
}
