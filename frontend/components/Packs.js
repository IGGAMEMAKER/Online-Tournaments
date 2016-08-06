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
  },
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
    cards: standardCards,

    chosenPack: -1,
    allPacks: standardPacks,

    packs: [
      {
        price: 100,
        buttons: [],
        color: 0,
        frees: []
      }
    ]
  };

  componentWillMount() {
    actions.initialize();

    InfoStore.addChangeListener(() => {
      this.setState({
        allPacks: InfoStore.getPacks(),
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

  render() {
    const chosenPack = this.state.chosenPack;
    console.log('chosenPack', chosenPack, this.state);
    // <div className="col-sm-3 col-md-3 col-xs-12">
    const CardList = this.state.cards.map((card) => (
      <div className="col-md-4 col-sm-6 col-xs-12">
        <PackPrize
          name={card.name}
          description={card.description}
          src={card.src}
          color={card.color}
        />
      </div>
    ));

    let PackList = '';
    let packIndex = 0;
    this.state.allPacks.forEach((pack, index) => {
      // <div className="col-sm-3 col-md-3 col-xs-6 killPaddings">
      // console.log('iterate...', pack, index, 'chosenPack', chosenPack);
      if (chosenPack === pack.packID) {
        packIndex = index;
        // pack.src ||
        PackList = (
          <div
            className="pack img-wrapper"
            style={`margin-bottom: 0px; background-image: url(${pack.src});`}
          ></div>
        );
      }
    });
    // style="margin: 0 auto; display: block;"

    let content = '';
    if (chosenPack < 0) {
      content = (
        <PackGallery
          chosePack={this.chosePack.bind(this)}
          packs={this.state.allPacks}
        />
      );
    } else {
      content = (
        <div>
          <div
            className="row pack-container"
            style="margin-top: 15px;"
          >
            {PackList}
            <br />
            <br />
            <button
              className="btn btn-primary btn-lg btn-block"
              style="border-radius: 0;"
              onClick={this.openPaid(chosenPack)}
            >Открыть пак за {this.state.allPacks[packIndex].price || 30} руб</button>
          </div>
          <br />
          <a
            onClick={this.choseAnother.bind(this)}
            style="cursor: pointer; text-underline: none;"
          >выбрать другой пак</a>
          <br />
          <h1 className="text-center"> Что может выпасть в паке? </h1>
          <div className="col-sm-12 col-md-12 col-xs-12 killPaddings">{CardList}</div>
        </div>
      );
    }

    return (
      <div>
        <div className="white text-center">{content}</div>
      </div>
    );
  }
}
