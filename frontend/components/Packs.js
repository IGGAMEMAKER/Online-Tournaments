import { h, Component } from 'preact';
import Card from './Packs/PackCard';
import PackPrize from './Packs/PackPrize';
import PackGallery from './Packs/PackGallery';

// import socketListener from '../helpers/SocketListener';
import actions from '../actions/ProfileActions';

import InfoStore from '../stores/InfoStore';

function openPack(packID, pay) {
  console.log('openPack pack page', packID, pay);
  actions.openPack(packID, pay);
}

const standardPacks = [
  {
    src: '/img/topics/realmadrid.jpg',
    name: 'realmadrid',
    id: 1
  },
  {
    src: '/img/topics/bale.jpg',
    name: 'bale',
    id: 2
  },
  {
    src: '/img/topics/manutd.jpg',
    name: 'manutd',
    id: 3
  },


  {
    src: '/img/topics/realmadrid.jpg',
    name: 'realmadrid',
    id: 1
  },
  {
    src: '/img/topics/bale.jpg',
    name: 'bale',
    id: 2
  },
  {
    src: '/img/topics/manutd.jpg',
    name: 'manutd',
    id: 3
  },

  {
    src: '/img/topics/realmadrid.jpg',
    name: 'realmadrid',
    id: 1
  },
  {
    src: '/img/topics/bale.jpg',
    name: 'bale',
    id: 2
  },
  {
    src: '/img/topics/manutd.jpg',
    name: 'manutd',
    id: 3
  },

  {
    src: '/img/topics/realmadrid.jpg',
    name: 'realmadrid',
    id: 1
  },
  {
    src: '/img/topics/bale.jpg',
    name: 'bale',
    id: 2
  },
  {
    src: '/img/topics/manutd.jpg',
    name: 'manutd',
    id: 3
  }
];

const standardCards = [
  {
    name: '2000 рублей',
    description: '2000 рублей на счёт',
    // src: '../../gifts/1000.png',
    src: '/img/topics/realmadrid/../../gifts/gold1.png',
    color: 0
  },
  {
    name: '500 рублей',
    description: '500 рублей на счёт',
    src: '/img/topics/realmadrid/../../gifts/gold1.png',
    color: 1
  },
  {
    name: '100 рублей',
    description: '100 рублей на счёт',
    src: '/img/topics/realmadrid/../../gifts/gold1.png',
    color: 2
  },
  {
    name: 'Футболка',
    description: 'Футболка твоего любимого клуба',
    src: '/img/topics/realmadrid/../../gifts/shirt.jpg',
    color: 1
  },
  {
    name: 'Футболка',
    // description: 'Выиграй футболку любимого клуба и мы подарим её тебе!',
    description: 'Футболка Реал Мадрид сезона 2016/2017',
    src: '/img/topics/realmadrid/../../gifts/shirt2.jpg',
    color: 1
  },
  {
    name: 'Футболка',
    description: 'Билет на турнир',
    src: 'http://www.sks-auto.ru/images/icons/bilet.png',
    // src: '/img/topics/realmadrid/../../gifts/shirt3.jpg',
    color: 1
  },
  {
    name: 'Карточка Модрича',
    description: 'Карточка Модрича для игры в Funny Football',
    src: '/img/topics/realmadrid/19.png',
    color: 1
  },
  {
    name: 'Карточка Модрича',
    description: 'Карточка Модрича для игры в Funny Football',
    src: '/img/topics/realmadrid/19.png',
    color: 1
  },
  {
    name: 'Карточка Модрича',
    description: 'Карточка Модрича для игры в Funny Football',
    src: '/img/topics/realmadrid/19.png',
    color: 1
  }
];

// PACKS.map(p => ({ src: p.image, packID: p.packID, name: p.topic, price: p.price })) ||

export default class PackPage extends Component {
  state = {
    chosenPack: -1,
    allPacks: standardPacks
  };

  componentWillMount() {
    actions.initialize();

    InfoStore.addChangeListener(() => {
      this.setState({
        allPacks: InfoStore.getPacks(),
        cards: InfoStore.getGifts()
      })
    })
  }

  openFree(packId) {
    return function () {
      openPack(packId, 0);
    };
  }

  openPaid(packId) {
    return function () {
      openPack(packId, 1);
    };
  }

  chosePack(id) {
    this.setState({ chosenPack: id });
    window.scrollTo(0, 0);
  }

  choseAnother() {
    this.setState({ chosenPack: -1 });
  }

  render(props, state) {
    const { chosenPack } = state;

    if (chosenPack < 0) {
      return (
        <div className="white text-center">
          <PackGallery chosePack={this.chosePack.bind(this)} packs={this.state.allPacks} />
        </div>
      );
    }

    console.log('chosenPack', chosenPack, state);
    // <div className="col-sm-3 col-md-3 col-xs-12">

    let packIndex = 0;
    try {
      packIndex = state.allPacks.filter(p => p.packID === chosenPack)[0].packID;
    } catch (e) {
      return '';
    }
    const pack = state.allPacks[packIndex];

    console.warn('packIndex', packIndex);

    const CardList = state.allPacks[packIndex].items.map(giftID => {
      const card = InfoStore.getGiftByGiftID(giftID);
      return (
        <div className="col-md-4 col-sm-6 col-xs-12">
          <PackPrize
            name={card.name}
            description={card.description}
            src={card.photoURL}
            color={card.color}
          />
        </div>
      )
    });
    // style="margin: 0 auto; display: block;"
    const pricePhrase =  pack.price ? `за ${pack.price} руб`: 'бесплатно';

    return (
      <div>
        <div className="white text-center">
          <div>
            <div className="row pack-container" style="margin-top: 15px;">
              <div
                className="pack img-wrapper"
                style={`margin-bottom: 0px; background-image: url(${pack.image});`}
              ></div>
              <br />
              <br />
              <button
                className="btn btn-primary btn-lg btn-block"
                style="border-radius: 0;"
                onClick={this.openPaid(chosenPack)}
              >Открыть пак {pricePhrase}</button>
            </div>
            <br />
            <a onClick={this.choseAnother.bind(this)} className="pointer-no-underline">
              выбрать другой пак
            </a>
            <br />

            <h1 className="text-center"> Что может выпасть в паке? </h1>
            <div className="col-sm-12 col-md-12 col-xs-12 killPaddings">
              {CardList}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
