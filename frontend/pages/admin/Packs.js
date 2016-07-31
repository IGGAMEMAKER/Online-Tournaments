import { h, Component } from 'preact';
import actions from '../../actions/AdminActions';
import store from '../../stores/AdminStore';

import PackPrize from '../../components/Packs/PackPrize';
import DarkCard from '../../components/Containers/DarkCard'; // same thing like PackPrize
import GiftForm from '../../components/Packs/GiftForm';

type Gift = {

}

type StateType = {
  gifts: Array<Gift>,
  newGift: Gift
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

    newGift: getEmptyGift()
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
    console.log('onChangeNewGift!!!', newGift);
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
    actions.editGift(this.state.gifts[i]);
  };

  removeGift = (i) => {
    actions.removeGift(this.state.gifts[i]._id);
  };

  render(props, state: StateType) {
    const giftData = state.gifts.map((g, i) => {
      return (
        <div>
          <div>
            <div className="col-sm-2">
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

    const packs = state.packs.map((p, i) => {
      return (
        <div className="white">
          <div className="col-sm-2">
            <div>{p.packID}</div>
            <div>{p.image}</div>
            <div>available: {p.available}</div>
            <div>visible: {p.visible}</div>
            <div>items: {p.items.toString()}</div>
            <div>colours: {p.colours.toString()}</div>
          </div>
          <div className="col-sm-4">
            <DarkCard
              src={`/img/cardLayers/${p.image}`}
              name={`cost: ${p.price}`}
              description={`packID: ${p.packID} cost: ${p.price}руб ${p._id}`}
            />
          </div>
        </div>
      );
    });

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
        <div className="height-fix white">
          <h2>Packs</h2>
          <div style="height: 150px;"></div>
          <div>{packs}</div>
        </div>
      </div>
    );
  }
}
