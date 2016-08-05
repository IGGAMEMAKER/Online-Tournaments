import { h, Component } from 'preact';
import actions from '../../actions/AdminActions';
import store from '../../stores/AdminStore';

import PackPrize from '../../components/Packs/PackPrize';
import DarkCard from '../../components/Containers/DarkCard'; // same thing like PackPrize
import GiftForm from '../../components/Packs/GiftForm';

import PackEditingForm from '../../components/Packs/PackEditingForm';

type Gift = {

}

type StateType = {
  gifts: Array<Gift>,
  packs: Array,
  view: string,

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

export default class Packs extends Component {
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
        gifts: store.getGifts(),
        packs: store.getPacks()
      })
    });

    actions.getGifts();
    actions.getAvailablePacks();
  }

  addGift = (gift) => {
    actions.addGift(gift);

    this.setState({
      gift: getEmptyGift()
    })
  };

  onChangeNewGift = (newGift) => {
    // console.log('onChangeNewGift!!!', newGift);
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

  editPack = (i) => {
    return (pack) => {
      console.warn('editPack, i=', i, pack);
      let packs = this.state.packs;
      packs[i] = Object.assign({}, packs[i], pack);

      setTimeout(() => {
        this.setState({ packs });
      }, 100);
    }
  };

  saveGiftChanges = (i) => {
    actions.editGift(this.state.gifts[i]);
  };

  savePackChanges = (i) => {
    actions.editPack(this.state.packs[i]);
  };

  removeGift = (i) => {
    actions.removeGift(this.state.gifts[i]._id);
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

  getGiftIndexByGiftID = (giftID) => {
    let index = -1;

    this.state.gifts.forEach((g, i) => {
      if (giftID === g._id) {
        index = i;
      }
    });

    return index;
  };

  drawGiftCard = (i) => {
    const g = this.state.gifts[i];
    return <PackPrize
      src={g.photoURL}
      name={g.name}
      description={g.description}
    />;
  };

  drawGiftCardTexted = (i) => {
    const g = this.state.gifts[i];
    // return <div>{g.name}</div>;
    return g.name;
  };

  getGiftInfoByGiftID = (giftID) => {
    let gift = null;

    this.state.gifts.forEach(g => {
      if (g._id === giftID) {
        gift = g;
      }
    });

    return gift;
  };

  getProbabilityOfGift = (packID, giftIndex) => {
    let pack = null;
    this.state.packs.filter(p => {
      if (p.packID === packID) {
        pack = p;
      }
    });

    if (!pack) {
      console.log('no pack found by id', packID);
      return 0;
    }

    const totalChances = pack.probabilities.reduce((previousValue, currentValue) => {
      return previousValue + currentValue;
    }, 0);

    if (totalChances === 0) {
      return 0;
    }

    const itemProbability = pack.probabilities[giftIndex];
    console.log('calculating probabilities of', giftIndex, ' in ', packID, ' equals ', itemProbability, '/', totalChances);
    return  itemProbability / totalChances;
  };

  selectPack = (i) => {
    const items = {};
    this.state.packs[i].items.forEach((p) => {
      const id = this.getGiftIndexByGiftID(p);

      if (id >= 0) {
        items[id] = 1;
      }
    }); //.map((p, i) => p._id);

    this.setState({
      items
    })
  };

  countableGift = (index) => {
    try {
      return this.state.gifts[index].properties['isCard'] ? 0 : this.state.gifts[index].price;
    } catch (e) {
      console.error(e, 'countableGift', index, this.state.gifts);
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

    console.log('gifts', state.gifts);
    const packs = state.packs.map((p, i) => {
      /*
       <div>{p.packID}</div>
       <div>{p.image}</div>
       <div>available: {p.available}</div>
       <div>visible: {p.visible}</div>
       <div>items: {p.items.toString()}</div>
       <div>probabilities: {p.probabilities.toString()}</div>
       <div>colours: {p.colours.toString()}</div>
       */
      const balanceAndProbabilities = p.items.map(itemID => {
        const index = this.getGiftIndexByGiftID(itemID);
        console.log(`converted _id=${itemID} to ${index}`);

        if (index < 0) {
          return 'invalid_gift';
        }

        console.log('balanceAndProbabilities', p.packID, index);
        // console.log('probabilities of pack ', p.packID, ' of gift ', index, state.items);

        return (
          <div>
            {this.drawGiftCardTexted(index)}&nbsp;
            {this.getProbabilityOfGift(p.packID, index)} %
            price: {this.countableGift(index)}
          </div>
        );
      });

      return (
        <div
          className="white"
          onClick={() => { this.selectPack(i) }}
        >
          <div className="col-sm-4">
            <PackEditingForm
              pack={p}
              onSubmit={() => { this.savePackChanges(i); }}
              onChange={this.editPack(i)}
              action="edit pack"
              removable
              onRemove={() => { this.removePack(i); }}
            />
          </div>
          <div className="col-sm-4">
            <DarkCard
              src={p.image}
              name={`cost: ${p.price}`}
              description={`packID: ${p.packID} cost: ${p.price}руб ${p._id}`}
            />
          </div>
          <div className="height-fix">
            <h3>Probabilities</h3>
            {balanceAndProbabilities}
          </div>
          <hr width="60%" className="white" />
        </div>
      );
    });

    const g = state.newGift;

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

    let selectedList = state.gifts.filter((g, i) => this.isAttached(i)).map(g => `"${g._id}"`);

    return (
      <div>
        <div className="height-fix white">
          <h2>Packs</h2>
          <a href="/api/packs/all" target="_blank">Copy item object and paste it in this page</a>
          <br />
          <button onClick={() => { this.setState({ items: {} }) }}>clear</button>
          {giftSelector}
          <div>{selectedList.toString()}</div>
          <input value={`${selectedList}`} className="black full" />
          <br />
          <label>test</label>
          <input className="black full" />
          <div style="height: 150px;"></div>
          <div>{packs}</div>
        </div>
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
