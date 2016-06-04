import { h, Component } from 'preact';
import request from 'superagent';

import LeaguePayButton from './Leagues/LeaguePayButton';

type PropsType = {
  joined: Boolean,
  team: Object
};

type LeagueType = {
  name: string,
  id: number,
  prizePool: number,
  includes: Array<number>,
  prices: Array<number>,
  available: boolean,
}

export default class League extends Component {
  state = {
  };

  componentWillMount() {
    // this.loadData();
  }

  drawLeague = (className, name, period, prizePool, price, style) => {
    return (
      <div
        className={className}
        style={style}
      >
        <h2 className="fadeText">{name}</h2>
        <p>{period}</p>
        <h3 className="fadeText">Призовой фонд {prizePool} рублей
        </h3>
        <div>
          <LeaguePayButton price={price} text="" />
        </div>
      </div>
    );
  };

  loadData() {
    request
      .get('/api/teams/')
      .end((err: String, res) => {
        const message: PropsType = res.body;
        console.log('got request', err, message);

        this.setState({ joined: message.joined, team: message.team });
      });
  }
  //
  render() {
    const leagues = [
      {
        name: 'Micro',
        description: '',
        id: 0,
        prizePool: 500,
        includes: [],
        prices: [0, 0],
        available: true,
        // color: 'purple',
        img: '#1abc9c',
      }, {
        name: 'Junior',
        description: '',
        id: 1,
        prizePool: 2000,
        includes: [0],
        prices: [150, 1500],
        available: true,
        color: 'red',
        img: '#9b59b6',
      }, {
        name: 'Elite',
        description: '',
        id: 2,
        prizePool: 8000,
        includes: [0, 1],
        prices: [350, 3500],
        available: true,
        color: 'green',
        img: '#e74c3c',
        // img: '#3498db',
      },
      // {
      //   name: 'Super Elite',
      //   description: '',
      //   id: 3,
      //   prizePool: 20000,
      //   includes: [0, 1, 2],
      //   prices: [500, 5000],
      //   available: false,
      //   color: 'carrot',
      //   img: '#e74c3c',
      // }
    ];
    const LeagueList = leagues.map((league: LeagueType, i) => {
      if (i === 0) return '';
      const includeList = league.includes.map((leagueID, index, arr) => {
        const count = arr.length;
        let phrase = '';
        const leagueName = leagues[leagueID].name;

        if (index === count - 1) {
          phrase = ` и ${leagueName}`;
          // if (count > 1) {
          // } else {
          //   phrase = leagueName;
          // }
        } else {
          let comma = ',';
          if (index === count - 2) {
            comma = '';
          }
          phrase = `${leagueName}${comma} `;
        }
        return phrase;
      });

      let color = league.color;
      let className = `white league-tab freeroll ctr offset-lg ${color}`;

      const style = {
        'background-color': league.img || league.color
      };

      const l1 = this.drawLeague(className, league.name, '1 месяц доступа', league.prizePool, league.prices[0], style);
      const l2 = this.drawLeague(className, `${league.name}+`, 'Годовой доступ (17% скидка)', league.prizePool * 12, league.prices[1], style);
      return (
        <div>
          {l1}
          {l2}
        </div>
      );
      
      /*
      return (
        <div className="offset-lg">
          <div
            className={className}
            style={style}
          >
            <h2 className="fadeText">{league.name}</h2>
            <p>30 дней доступа</p>
            <h3 className="fadeText">Призовой фонд {league.prizePool} рублей
            </h3>
            <div><h3>Включая турниры лиги {includeList}</h3></div>
            <div>
              <LeaguePayButton price={league.prices[0]} text='' />
            </div>
          </div>


          <div
            className={className}
            style={style}
          >
            <h2 className="fadeText">{league.name}+</h2>
            <p>Годовой доступ (17% скидка)</p>
            <h3 className="fadeText">Призовой фонд {league.prizePool * 12} рублей
            </h3>
            <div><p>Включая турниры лиги {includeList}</p></div>
            <div>
              <LeaguePayButton price={league.prices[1]} text='' />
            </div>
          </div>
        </div>
      );*/
    });

    const freeLeague = (
      <div
        className="white league-tab freeroll ctr offset-lg"
      >
        <h2 className="fadeText">{leagues[0].name}</h2>
        <h3 className="fadeText">
          Призовой фонд {leagues[0].prizePool} рублей
        </h3>
        <b>Вы участвуете</b>
      </div>
    );

    return (
      <div>
        <h1 className="white">Лиги</h1>
        <div>
          {freeLeague}

          {LeagueList}
        </div>
      </div>
    );
  }
}
