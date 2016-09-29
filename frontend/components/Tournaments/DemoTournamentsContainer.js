import { h, Component } from 'preact';
import request from 'superagent';
import Button from '../Shared/Button';

import clipboard from '../../helpers/copy-to-clipboard';

type PropsType = {}

type StateType = {
  copiedTestId: string,
}

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
    copiedTestId: '0',
    tests: []
  };

  getDemoTournaments = async () => {
    try {
      const response: ResponseType = await request.get('/api/tests/');

      this.setState({ tests: response.body.msg });
    } catch (err) {
      console.error('getDemoTournaments', err);
    }
  };

  componentWillMount() {
    this.getDemoTournaments();
  }

  shouldComponentUpdate(newProps: PropsType, newState: StateType) {
    const props: PropsType = this.props;
    const state: StateType = this.state;

    return true;
  }

  copyTestLink = (id) => {
    clipboard(id);

    this.setState({ copiedTestId: id });
  };

  renderUserResult = (tournament: DemoTournament) => {
    return (
      <div>
        <h2>Ваш результат</h2>
        <h1>{tournament.points} / 6</h1>
        <br />
        <Button text="Пройти ещё раз" />
      </div>
    );
  };

  renderTestCardContent = (tournament: DemoTournament) => {
    const id = tournament.id;
    const link = `/Tests?test=${tournament.link}&id=${id}`;

    const copiedTest = this.state.copiedTestId === id;
    const linkTest = copiedTest ?
      'Ссылка скопирована. Отправьте её друзьям!' : 'Скопировать ссылку на тест';

    return (
      <div>
        <label className="text-small test-description">{tournament.description}</label>
        <div style="height: 95px;"></div>
        <a className="link" href={link}>Пройти тест</a>
        <br />
        <br />
        <div>
          <input
            id={id}
            type="text"
            style="color: black; opacity: 0;"
            value={`http://online-tournaments.org${link}`}
          />
        </div>
        <a
          className={`pointer ${copiedTest ? 'white' : ''}`}
          style="text-decoration: none;"
          onClick={() => this.copyTestLink(id) }
        >{linkTest}</a>
        <br />
        <br />
      </div>
    );
  };

  renderTest = (tournament: DemoTournament) => {
    const fadingStatus = 'faded'; // if played ... this might change
    // const className = `demo-tournament-container light-blue ${fadingStatus} lighter`;
    const className = `demo-tournament-container ${fadingStatus} lighter`;


    const testCardContent = tournament.played ?
      this.renderUserResult(tournament) : this.renderTestCardContent(tournament);

    return (
      <div className={className} style={{'background-image': `url("${tournament.cover}")`}}>
        <div className="white tournament-centerize" style="z-index: 101">
          {testCardContent}
        </div>
      </div>
    );
    // className={`demo-tournament-container light-blue img-responsive darkened-centered-container ${fadingStatus}`}
  };

  render(props: PropsType, state: StateType) {
    const tests = state.tests.map(this.renderTest);

    return (
      <div style="margin-bottom: 35px">{tests}</div>
    );
  }
}
