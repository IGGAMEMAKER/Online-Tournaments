import { h, Component } from 'preact';
import DemoTest from './Demo/DemoTest';
import DemoResult from './Demo/DemoResult';
import DemoTournamentSelector from './Demo/DemoTournamentSelector';

const DEMO_STAGE_TEST = 'DEMO_STAGE_TEST';
const DEMO_STAGE_RESULT = 'DEMO_STAGE_RESULT';
const DEMO_STAGE_PACK_RECEIVED = 'DEMO_STAGE_PACK_RECEIVED';
const DEMO_STAGE_PACK_OPENED = 'DEMO_STAGE_PACK_OPENED';
const DEMO_STAGE_TOURNAMENT_SELECTOR = 'DEMO_STAGE_TOURNAMENT_SELECTOR';

type PropsType = {}

type StateType = {
  stage: string,

  result: number,
}

export default class Demo extends Component {
  state = {
    stage: DEMO_STAGE_TEST,
    // stage: DEMO_STAGE_RESULT,

    result: 0
  };

  setStage = (stage) => {
    this.setState({ stage })
  };

  goToResultPage = (result) => {
    this.setState({ stage: DEMO_STAGE_RESULT, result })
  };

  goToTournamentSelectorPage = () => {
    // this.setState({ result: this.state.result + 1 });
    this.setStage(DEMO_STAGE_TOURNAMENT_SELECTOR);
  };

  componentWillMount() {}

  render(props: PropsType, state: StateType) {
    if (state.stage === DEMO_STAGE_TEST) {
      return <DemoTest next={this.goToResultPage} topic="realmadrid" />;
    }

    if (state.stage === DEMO_STAGE_RESULT) {
      return <DemoResult next={this.goToTournamentSelectorPage} result={state.result} />;
    }

    if (state.stage === DEMO_STAGE_TOURNAMENT_SELECTOR) {
      return <DemoTournamentSelector next={this.goToTournamentSelectorPage} />;
    }

    return (
      <div>
        stage error
      </div>
    );
  }
}
