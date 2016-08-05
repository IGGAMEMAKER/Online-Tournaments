import { h, Component } from 'preact';
import actions from '../../actions/AdminActions';
import store from '../../stores/AdminStore';

import PackPrize from '../../components/Packs/PackPrize';
import DarkCard from '../../components/Containers/DarkCard'; // same thing like PackPrize

import PackEditingForm from '../../components/Packs/PackEditingForm';

import AdminGifts from '../../components/Gifts/AdminGifts';
import sendError from '../../helpers/sendError';

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

  savePackChanges = (i) => {
    actions.editPack(this.state.packs[i]);
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

  drawGiftCard = (i) => {
    const g = this.state.gifts[i];
    return <PackPrize
      src={g.photoURL}
      name={g.name}
      description={g.description}
    />;
  };

  selectPack = (i) => {
    const items = {};
    this.state.packs[i].items.forEach((p) => {
      const id = store.getGiftIndexByGiftID(p);

      if (id >= 0) {
        items[id] = 1;
      }
    }); //.map((p, i) => p._id);

    this.setState({
      items
    })
  };

  countableGift = (gift) => {
    try {
      return gift.properties['isCard'] ? 0 : gift.price;
    } catch (e) {
      sendError(e, 'countableGift', { gift, gifts: this.state.gifts});
      return 0;
    }
  };

  roundingToTwoDigits = (num) => {
    return Math.floor(num * 100) / 100;
  };

  packList = () => {
    const state: StateType = this.state;

    return state.packs.map((p, i) => {
      let decrease = 0;
      const totalChances = p.probabilities.reduce((prev, curr) => prev + curr, 0);

      const balanceAndProbabilities = p.probabilities.map((chance, id) => {
        const giftID = p.items[id];
        const gift = store.getGiftByGiftID(giftID);

        if (!gift) {
          return <div>no gift data: {chance} {id} in pack {p.packID}</div>;
        }

        const giftChance = totalChances > 0 ? chance / totalChances : 0;
        const price = this.countableGift(gift);
        decrease += price * chance;

        return (
          <div>
            {gift.name}&nbsp;
            {Math.floor(giftChance * 100)}%&nbsp;
            price: {price}
          </div>
        );
      });

      const balance = totalChances * p.price;
      const saldo = (balance - decrease) / totalChances;
      let balanceTabColour = 'green';
      let balanceTabText = `Saldo is +${saldo}`;

      if (saldo <= 0) {
        balanceTabColour = 'red';
        balanceTabText = `Saldo is NEGATIVE: ${saldo}`;
      }

      const balanceTab = (
        <div style={`color: ${balanceTabColour}; font-size: 20px;`}>{balanceTabText}</div>
      );

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
              onRemove={() => { actions.removePack(p.packID); }}
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
            <div>Total chances of this pack is: {totalChances}</div>
            {balanceAndProbabilities}
            <h2>{p.probabilities.length !== p.items.length ? 'UNBALANCED!!! fix it' : 'ok'}</h2>
            <div>{balanceTab}</div>
          </div>
          <hr width="60%" className="white" />
        </div>
      );
    });
  };

  render(props, state: StateType) {
    const packs = this.packList();

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
        <div className="height-fix white">
          <h2>Packs</h2>
          <a href="/api/packs/all" target="_blank">Copy item object and paste it in this page</a>
          <br />

          <button onClick={() => { this.setState({ items: {} }) }}>clear</button>
          <div>
            <h3 className="">Gift selector</h3>
            {giftSelector}
          </div>
          <input value={`[${selectedList}]`} className="black full" />
          <br />
          <label>test</label>

          <input className="black full" />
          <div style={`height: 150px;`}></div>
          <div>{packs}</div>
        </div>

        <div className="height-fix white">
          <AdminGifts />
        </div>
      </div>
    );
  }
}
