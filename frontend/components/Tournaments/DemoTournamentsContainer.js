import { h, Component } from 'preact';
import request from 'superagent';
import Button from '../Shared/Button';

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

        // <h1>Тест</h1>
    return (
      <div>
        <label className="text-small test-description">{tournament.description}</label>
        <br />
        <br />
        <Button text="Пройти тест" />
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
      <div>
        {tournaments}
      </div>
    );
  }
}
