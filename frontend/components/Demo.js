import { h, Component } from 'preact';
import DemoTest from './Demo/DemoTest';
import DemoResult from './Demo/DemoResult';
import DemoTournamentSelector from './Demo/DemoTournamentSelector';


type PropsType = {}
const DEMO_STAGE_TEST = 'DEMO_STAGE_TEST';
const DEMO_STAGE_RESULT = 'DEMO_STAGE_RESULT';

const DEMO_STAGE_PACK_RECEIVED = 'DEMO_STAGE_PACK_RECEIVED';
const DEMO_STAGE_PACK_OPENED = 'DEMO_STAGE_PACK_OPENED';

const DEMO_STAGE_TOURNAMENT_SELECTOR = 'DEMO_STAGE_TOURNAMENT_SELECTOR';

type StateType = {
  stage: string,
}

type ResponseType = {}

export default class Demo extends Component {
  state = {
    stage: DEMO_STAGE_RESULT
  };

  setStage = (stage) => {
    this.setState({ stage })
  };

  goToResultPage = () => {
    this.setStage(DEMO_STAGE_RESULT);
  };

  goToTournamentSelectorPage = () => {
    this.setStage(DEMO_STAGE_TOURNAMENT_SELECTOR);
  };

  componentWillMount() {}

  render(props: PropsType, state: StateType) {
    if (state.stage === DEMO_STAGE_TEST) {
      return <DemoTest next={this.goToResultPage} />;
    }

    if (state.stage === DEMO_STAGE_RESULT) {
      return <DemoResult next={this.goToTournamentSelectorPage} result={1} />;
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
