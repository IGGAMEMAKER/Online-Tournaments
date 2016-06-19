import { h, Component } from 'preact';
import Modal from './Modal';
import store from '../../stores/ProfileStore';
import actions from '../../actions/ProfileActions';

type PropsType = {
  tournaments: Array,
}

type StateType = {
  tournaments: Array,
}

type ResponseType = {}

export default class PlayModalContainer extends Component {
  state = {
    tournaments: [],
    visible: false,
  };

  componentWillMount() {
    // store.addChangeListener(() => {
    //   this.setState({
    //     runningTournaments: store.getRunningTournaments,
    //     visible: true,
    //   });
    // });
    // actions.initialize();
  }

  render(props: PropsType, state: StateType) {
    const tournaments: Array = props.tournaments;

    if (!tournaments.length || !state.visible) return '';

    console.log('render runningTournaments', tournaments);
    const header = 'Турниры начинаются!';
    const body = tournaments.join();
    const footer = (
      <button
        className="btn btn-default"
        onClick={() => { this.setState({ visible: false }); }}
      >Закрыть</button>
    );
    return <Modal data={{ header, body, footer }} />;
  }
}
