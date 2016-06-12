import { h, Component } from 'preact';
import request from 'superagent';
// import Chat from '../components/Activity/Chat';

import Card from './Packs/PackCard';
import Pack from './Packs/Pack';
import PackGallery from './Packs/PackGallery';

function openPack(packID, pay) {
  request
    .post(`openPack/${packID}/${pay}`)
    .end(console.log);
}

export default class PackPage extends Component {
  state = {
    cards: [
      {
        name: '2000 рублей',
        description: '2000 рублей на счёт',
        // src: '../../gifts/1000.png',
        src: '../../gifts/gold1.png',
        color: 0
      },
      {
        name: '500 рублей',
        description: '500 рублей на счёт',
        src: '../../gifts/gold1.png',
        color: 1
      },
      {
        name: '100 рублей',
        description: '100 рублей на счёт',
        src: '../../gifts/gold1.png',
        color: 2
      },
      {
        name: 'Футболка',
        description: 'Выиграй футболку любимого клуба и мы подарим её тебе!',
        src: '../../gifts/shirt.jpg',
        color: 1
      },
      {
        name: 'Футболка',
        description: 'Выиграй футболку любимого клуба и мы подарим её тебе!',
        src: '../../gifts/shirt2.jpg',
        color: 1
      },
      {
        name: 'Футболка',
        description: 'Выиграй футболку любимого клуба и мы подарим её тебе!',
        src: '../../gifts/shirt3.jpg',
        color: 1
      },
      {
        name: 'Карточка Модрича',
        description: 'Карточка Модрича для игры в Funny Football',
        src: '19.png',
        color: 1
      },
      {
        name: 'Карточка Модрича',
        description: 'Карточка Модрича для игры в Funny Football',
        src: '19.png',
        color: 1
      },
      {
        name: 'Карточка Модрича',
        description: 'Карточка Модрича для игры в Funny Football',
        src: '19.png',
        color: 1
      },
    ],

    chosenPack: -1,
    allPacks: PACKS.map(p => ({ src: p.image, packID: p.packID, name: p.topic, price: p.price })) || [
      {
        src: '/img/topics/realmadrid.jpg',
        name: 'realmadrid',
        id: 1,
      },
      {
        src: '/img/topics/bale.jpg',
        name: 'bale',
        id: 2,
      },
      {
        src: '/img/topics/manutd.jpg',
        name: 'manutd',
        id: 3,
      },


      {
        src: '/img/topics/realmadrid.jpg',
        name: 'realmadrid',
        id: 1,
      },
      {
        src: '/img/topics/bale.jpg',
        name: 'bale',
        id: 2,
      },
      {
        src: '/img/topics/manutd.jpg',
        name: 'manutd',
        id: 3,
      },

      {
        src: '/img/topics/realmadrid.jpg',
        name: 'realmadrid',
        id: 1,
      },
      {
        src: '/img/topics/bale.jpg',
        name: 'bale',
        id: 2,
      },
      {
        src: '/img/topics/manutd.jpg',
        name: 'manutd',
        id: 3,
      },

      {
        src: '/img/topics/realmadrid.jpg',
        name: 'realmadrid',
        id: 1,
      },
      {
        src: '/img/topics/bale.jpg',
        name: 'bale',
        id: 2,
      },
      {
        src: '/img/topics/manutd.jpg',
        name: 'manutd',
        id: 3,
      },
    ],

    packs: [
      {
        price: 100,
        buttons: [],
        color: 0,
        frees: [],
      },
    ]
  };

  componentWillMount() {
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
    // console.log('chosePack', id);
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
        <Card
          name={card.name}
          description={card.description}
          src={`/img/topics/realmadrid/${card.src}`}
          color={card.color}
        />
      </div>
    ));

    let PackList = '';
    let packIndex = 0;
    this.state.allPacks.forEach((pack, index) => {
      // <div className="col-sm-3 col-md-3 col-xs-6 killPaddings">
      console.log('iterate...', pack, index, 'chosenPack', chosenPack);
      if (chosenPack === pack.packID) {
        packIndex = index;
        PackList = (
          <img
            className="pack img-wrapper"
            style="cursor: pointer; margin-bottom: 0px;"
            src={pack.src}
            alt={pack.name}
          />
        );
      }
    });
    // style="margin: 0 auto; display: block;"

    let content = '';
    if (chosenPack < 0) {
      content = <PackGallery chosePack={this.chosePack.bind(this)} packs={this.state.allPacks} />;
    } else {
      content = (
        <div>
          <div
            className="row pack-container light-blue-big"
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
          <h1 className="text-center"> Что может выпасть в этом паке? </h1>
          <div className="col-sm-12 col-md-12 col-xs-12 killPaddings">{CardList}</div>
        </div>
      );
    }

    return (
      <div>
        <div className="white text-center">
          {content}
        </div>
      </div>
    );
  }
}
