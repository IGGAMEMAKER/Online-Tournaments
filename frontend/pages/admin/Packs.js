import { h, Component } from 'preact';
import actions from '../../actions/AdminActions';
import store from '../../stores/AdminStore';

import PackPrize from '../../components/Packs/PackPrize';
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
    const giftData = state.gifts.map((g, i) =>
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

    const packs = state.packs.map((p, i) => {
      return <div className="white">{JSON.stringify(p)}</div>;
    });
    // const gifts = state.gifts.map((g) =>
    //   <div className="col-sm-4">
    //     <PackPrize
    //       src={g.photoURL}
    //       name={g.name}
    //       description={g.description}
    //     />
    //   </div>
    // );

    const g = state.newGift;
    console.log('render admin pack', g);

    return (
      <div>
        <div style="overflow: hidden; height: auto;">
          <h2 className="white">Все карточки</h2>
          {giftData}
        </div>

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

        <div style="height: 150px;"></div>
        <div>{packs}</div>
      </div>
    );
  }
}
