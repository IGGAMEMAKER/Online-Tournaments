import { h, Component } from 'preact';
import DemoTest from './Demo/DemoTest';
import DemoResult from './Demo/DemoResult';
import DemoTournamentSelector from './Demo/DemoTournamentSelector';
import request from 'superagent';

const DEMO_STAGE_LOADING_TEST = 'DEMO_STAGE_LOADING_TEST';
const DEMO_STAGE_TEST = 'DEMO_STAGE_TEST';
const DEMO_STAGE_RESULT = 'DEMO_STAGE_RESULT';
const DEMO_STAGE_PACK_RECEIVED = 'DEMO_STAGE_PACK_RECEIVED';
const DEMO_STAGE_PACK_OPENED = 'DEMO_STAGE_PACK_OPENED';
const DEMO_STAGE_TOURNAMENT_SELECTOR = 'DEMO_STAGE_TOURNAMENT_SELECTOR';

type PropsType = {
  id: string,
  link: string,
}

type StateType = {
  stage: string,
  testData: Object,

  result: number,
}

export default class Demo extends Component {
  state = {
    stage: DEMO_STAGE_TEST,

    result: 0
  };

  goToResultPage = (result) => {
    this.setState({ stage: DEMO_STAGE_RESULT, result })
  };

  goToTournamentSelectorPage = () => {
    // this.setState({ result: this.state.result + 1 });
    this.setState({ stage: DEMO_STAGE_TOURNAMENT_SELECTOR })
  };

  componentWillMount() {
    this.loadData(this.props);
  }

  loadData = async (props: PropsType) => {
    const response = await request.get(`/api/tests/${props.id}`);

    console.log('loadData in Demo.js', response.body.msg);

    this.setState({ stage: DEMO_STAGE_TEST, testData: response.body.msg });
  };

  render(props: PropsType, state: StateType) {
    if (state.stage === DEMO_STAGE_LOADING_TEST) {
      return <div>загрузка вопросов...</div>
    }

    if (state.stage === DEMO_STAGE_TEST) {
      return (
        <DemoTest
          next={this.goToResultPage}
          topic="realmadrid"
          data={state.testData}
        />
      );
    }

    if (state.stage === DEMO_STAGE_RESULT) {
      return <DemoResult next={this.goToTournamentSelectorPage} result={state.result} />;
    }

    if (state.stage === DEMO_STAGE_TOURNAMENT_SELECTOR) {
      return <DemoTournamentSelector next={this.goToTournamentSelectorPage} />;
    }

    return (
      <div>
        stage error. Report to admin
      </div>
    );
  }
}
