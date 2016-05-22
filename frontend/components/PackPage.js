import { h, Component } from 'preact';
import request from 'superagent';
import Card from './Packs/PackCard';
import Pack from './Packs/Pack';
console.log('pack page opened');

export default class PackPage extends Component {
  state = {
    cards: [{
      name: 'name',
      description: 'descr',
      src: '19.png',
      color: 1
    }],

    packs: [
      {
        price: 100,
        color: 1,
      },
      {
        price: 150,
        color: 2,
        frees: 14
      },
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

  // function drawPack(pack){
  //   var backgroundImage = '\'';
  //   backgroundImage += pack.image;
  //   backgroundImage = '/img/cardLayers/'+pack.image;
  //   // backgroundImage += '\'';
  //
  //   var text = ''
  //   var style = 'background-image:url('+backgroundImage+')'
  //   text+= '<img border="0" class="card img-wrapper" style="'+style+'" src="/img/topics/realmadrid/pack.png">'
  //   return text;
  // }
  //
  // function drawPackButton(pack){
  //   var text = '';
  //   text += '<div class="col-sm-3 col-md-3 col-xs-6 killPaddings" >' // style="margin: auto;"
  //   text += drawPack(pack);
  //   var i = pack.packID;
  //   text += '<button id="free-pack'+i+'" disabled class="btn btn-success full" onclick="openPack('+i+', 0)"> Открыть <br> бесплатно  </button><br><br>'
  //   text += '<button class="btn btn-primary full" onclick="openPack('+i+', 1)"> Открыть ('+pack.price+'р) </button>'
  //   text += '</div>'
  //   return text;
  // }
  //
  // function drawPackButtons(packs){
  //   var crd = {
  //     photoURL: 'pack.png',
  //     colour: 0
  //   }
  //
  //   console.log('packs', 'drawPackButtons', packs);
  //
  //   var text = '<div style="margin:20px">';
  //
  //   for (var i = packs.length - 1; i >= 0; i--) {
  //     text += drawPackButton(packs[i])
  //   };
  //   text += '</div>'
  // }

  openPack(packID, pay) {
    request
      .post(`openPack/${packID}/${pay}`)
      .end(console.log);
  };

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

    const CardList = this.state.cards.map((card) => (
      <div className="col-sm-3 col-md-3 col-xs-12">
        <Card name={card.name} description={card.description} src={`/img/topics/realmadrid/${card.src}`} color={card.color} />
      </div>
    ));

    const PackList = this.state.packs.map((pack, index) => {

      return (
        <div className="col-sm-3 col-md-3 col-xs-6 killPaddings">
          <Pack pack={pack} onClick={this.openPaid(index)} onClickFree={this.openFree(index)} />
        </div>
      );
    });

    return (
      <div className="white">
        {PackList}
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        {CardList}
      </div>
    );
  }
}
