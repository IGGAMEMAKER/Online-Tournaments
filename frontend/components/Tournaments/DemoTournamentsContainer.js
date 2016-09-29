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
    console.log('copyTestLink');
    clipboard(id);
    this.setState({ copiedTestId: id });
  };

  renderTestCardContent = (tournament: DemoTournament) => {
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
    const id = tournament.id;

    const { copiedTestId } = this.state;

    const link = `/Tests?test=${tournament.link}&id=${id}`;

    const linkTest = copiedTestId === id ? 'Ссылка скопирована. Отправьте её друзьям!' : 'Скопировать ссылку на тест';

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
        <div>
          <input
            id={id}
            type="text"
            style="color: black; opacity: 0;"
            value={`http://online-tournaments.org${link}`}
          />
        </div>
        <a
          className={`pointer ${copiedTestId === id ? 'white' : '' }`}
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

    const style = { 'background-image': `url("${tournament.cover}")` };
    // const className = `demo-tournament-container light-blue ${fadingStatus} lighter`;
    const className = `demo-tournament-container ${fadingStatus} lighter`;

    return (
      <div className={className} style={style}>
        <div className="white tournament-centerize" style="z-index: 101">
          {this.renderTestCardContent(tournament)}
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
