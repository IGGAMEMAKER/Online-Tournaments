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
        color: 'purple',
        img: '#9b59b6',
      }, {
        name: 'Junior',
        description: '',
        id: 1,
        prizePool: 2000,
        includes: [0],
        prices: [150, 1500],
        available: true,
        color: 'red',
        img: '#2c3e50',
      }, {
        name: 'Elite',
        description: '',
        id: 2,
        prizePool: 8000,
        includes: [0, 1],
        prices: [350, 3500],
        available: true,
        color: 'green',
        img: '#3498db',
      }, {
        name: 'Super Elite',
        description: '',
        id: 3,
        prizePool: 20000,
        includes: [0, 1, 2],
        prices: [500, 5000],
        available: false,
        color: 'carrot',
        img: '#e74c3c',
      }
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
      let className = `white league-tab ${color}`;

      const style = {
        'background-color': league.img || league.color
      };

      return (
        <div>
          <div
            className={className}
            style={style}
          >
            <h2>{league.name}</h2>
            <p>30 дней доступа</p>
            <h3>Призовой фонд
              <br />
              {league.prizePool} рублей
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
            <h2>{league.name}+</h2>
            <p>Годовой доступ (17% скидка)</p>
            <h3>Призовой фонд
              <br />
              {league.prizePool * 12} рублей
            </h3>
            <div><h3>Включая турниры лиги {includeList}</h3></div>
            <div>
              <LeaguePayButton price={league.prices[1]} text='' />
            </div>
          </div>
        </div>
      );
    });

    const freeLeague = (
      <div
        className="white league-tab purple"
      >
        <h2>{leagues[0].name}</h2>
        <p>30 дней доступа</p>
        <h3>
          Призовой фонд
          <br />
          {leagues[0].prizePool} рублей
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
