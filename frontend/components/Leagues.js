import { h, Component } from 'preact';
import request from 'superagent';

// import TeamCreateForm from './Team/TeamCreateForm';

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
        id: 0,
        prizePool: 500,
        includes: [],
        prices: [0, 0],
        available: true,
      }, {
        name: 'Junior',
        id: 1,
        prizePool: 2000,
        includes: [0],
        prices: [150, 1300],
        available: true,
      }, {
        name: 'Elite',
        id: 2,
        prizePool: 8000,
        includes: [0, 1],
        prices: [350, 3000],
        available: true,
      }, {
        name: 'SuperElite',
        id: 3,
        prizePool: 30000,
        includes: [0, 1, 2],
        prices: [1000, 10000],
        available: false,
      }
    ];
    const LeagueList = leagues.map((league: LeagueType, i) => {
      let includes = '';
      const includeList = league.includes.map((leagueID, index, arr) => {
        const count = arr.length;
        let phrase = '';
        const leagueName = leagues[leagueID].name;

        if (index === count - 1) {
          if (count > 1) {
            phrase = ` и ${leagueName}`;
          } else {
            phrase = leagueName;
          }
        } else {
          let comma = ',';
          if (index === count - 2) {
            comma = '';
          }
          phrase = `${leagueName}${comma} `;
        }
        return phrase;
      });

      if (league.includes.length) {
        includes = (
          <div>
            <h3>Включая турниры лиги {includeList}</h3>
          </div>
        );
      }
      return (
        <div className="white">
          <h2>{league.name}</h2>
          <h3>Суммарный призовой фонд: {league.prizePool}</h3>
          {includes}
        </div>
      );
    });

    console.log('Leagues');
    return (
      <div>
        <h1 className="white">Leagues</h1>
        <div>
          {LeagueList}
        </div>
      </div>
    );
  }
}
