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
    view: VIEWS_IMAGED,

    newGift: getEmptyGift(),
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
    console.log('onChangeNewGift!!!', newGift);
    this.setState({ newGift })
  };

  // /img/topics/realmadrid/19.png

  render(props, state: StateType) {
    const giftData = state.gifts.map((g, i) =>
      <div className="col-sm-2">
        <div>
          <label className="white">photoURL</label>
          <input type="text" name="photoURL" value={g.photoURL} />
          <br />
          <label className="white">name</label>
          <input type="text" name="name" value={g.name} />
          <br />
          <label className="white">description</label>
          <input type="text" name="description" value={g.description} />
          <br />
          <label className="white">price</label>
          <input type="number" name="price" value={g.price} />
          <br />
          <label className="white">properties</label>
          <input type="text" name="properties" value={JSON.stringify(g.properties || {})} />
          <br />
          <PackPrize
            src={`/img/topics/realmadrid/${g.photoURL}`}
            name={g.name}
            description={g.description}
          />
        </div>
      </div>
    );
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
      </div>
    );
  }
}
