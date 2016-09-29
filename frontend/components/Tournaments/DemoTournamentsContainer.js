import { h, Component } from 'preact';
import request from 'superagent';
import Button from '../Shared/Button';

import clipboard from '../../helpers/copy-to-clipboard';

type PropsType = {}

type StateType = {}

type ResponseType = {
  body: {
    msg: Object
  }
}

type DemoTournament = {
  // questions: Array,
  // answers: Array,
  id: string,
  played: boolean,
  points: number,
  topics: Object,
  description: string,
  cover: string
}

export default class DemoTournamentsContainer extends Component {
  state = {
    tournaments: [
      {
        description: 'Тест: На сколько ты ботан',
      },
      {
        description: 'Тест: Откуда берутся дети',
      },
      {
        description: 'TEXT',
        played: true,
        points: 5
      },
    ]
  };
  //
  getDemoTournaments = async () => {
    try {
      // const response: ResponseType = await request.get('/api/tournaments/demo');
      const response: ResponseType = await request.get('/api/tests/');

      console.log('getDemoTournaments', response.body);

      this.setState({ tournaments: response.body.msg });
    } catch (err) {
      console.error('getDemoTournaments', err);
    }
  };

  componentWillMount() {
    this.getDemoTournaments();
  }

  getComponentContent = (tournament: DemoTournament) => {
    if (tournament.played) {
      return (
        <div>
          <h2>Ваш результат</h2>
          <h1>{tournament.points} / 6</h1>
          <br />
          <Button text="Пройти ещё раз" />
        </div>
      );
    }

    const link = `/Tests?test=${tournament.link}&id=${tournament.id}`;
        // <h1>Тест</h1>
    return (
      <div>
        <label className="text-small test-description">{tournament.description}</label>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <a className="link" href={link}>Пройти тест</a>
        <br />
        <br />
        <input
          id={tournament.id}
          type="text"
          style="color: black; opacity: 0;"
          value={`http://online-tournaments.org${link}`}
        />
        <Button onClick={() => clipboard(tournament.id)} text="Скопировать ссылку на тест" />
        <br />
        <br />
      </div>
    );
  };

  // static renderDemoTournament(tournament: DemoTournament) {
  renderDemoTournament = (tournament: DemoTournament) => {
    // const fadingStatus = tournament.played ? '' : 'faded';
    const fadingStatus = 'faded';
    // const cover = `url("/img/rounds/Benzema.jpg")`;
    const cover = `url("${tournament.cover}")`;
    const demoCardContent = this.getComponentContent(tournament);

        // className={`demo-tournament-container light-blue img-responsive darkened-centered-container ${fadingStatus}`}
    return (
      <div
        className={`demo-tournament-container light-blue ${fadingStatus} lighter`}
        style={{ 'background-image': cover }}
      >
        <div className="white tournament-centerize" style="z-index: 101">
          {demoCardContent}
        </div>
      </div>
    );
  };

  render(props: PropsType, state: StateType) {
    const tournaments = state.tournaments.map(this.renderDemoTournament);

    return (
      <div style="margin-bottom: 35px">
        {tournaments}
      </div>
    );
  }
}
