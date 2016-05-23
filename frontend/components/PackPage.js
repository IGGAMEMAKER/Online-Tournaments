import { h, Component } from 'preact';
import request from 'superagent';
import Card from './Packs/PackCard';
import Pack from './Packs/Pack';
console.log('pack page opened');

const FREES = 0;
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

    packs: [
      {
        price: 100,
        color: 0,
        frees: FREES,
      },
      {
        price: 25,
        color: 1,
        frees: FREES,
      },
      // {
      //   price: 10,
      //   color: 2,
      //   frees: FREES,
      // },
    ]
  };

  componentWillMount() {
    // // setInterval(() => {
    // request
    //   .get('/api/teams/')
    //   .end((err: String, res) => {
    //     const message: PropsType = res.body;
    //     console.log('got request', err, message);
    //
    //     this.setState({ joined: message.joined, team: message.team });
    //     // this.setState({ joined: TEAM_JOINED_TRUE, team: message.team });
    //   });
    // // }, 2000);
  }

  openPack(packID, pay) {
    request
      .post(`openPack/${packID}/${pay}`)
      .end(console.log);
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


  render() {
    console.log('pack page render');

    // <div className="col-sm-3 col-md-3 col-xs-12">
    const CardList = this.state.cards.map((card) => (
      <div className="col-sm-4 col-md-4 col-xs-12">
        <Card name={card.name} description={card.description} src={`/img/topics/realmadrid/${card.src}`} color={card.color} />
      </div>
    ));

    const PackList = this.state.packs.map((pack, index) => {
      // <div className="col-sm-3 col-md-3 col-xs-6 killPaddings">
      return (
        <div className="pack">
          <Pack pack={pack} onClick={this.openPaid(index)} onClickFree={this.openFree(index)} />
        </div>
      );
    });
    // style="margin: 0 auto; display: block;"
    return (
      <div className="white text-center">
        <h1 className=""> Испытай удачу в паках </h1>
        <h1 className=""> Открывай паки - выигрывай призы! </h1>
        <div className="row center">
          <center>
            {PackList}
          </center>
        </div>
        <h1 className="text-center"> Что может выпасть в паках? </h1>
        <div className="col-sm-12 col-md-12 col-xs-12 killPaddings">
          {CardList}
        </div>
      </div>
    );
  }
}
