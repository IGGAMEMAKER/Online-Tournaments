import { h, Component } from 'preact';
import { ModalMessage } from '../types';

import store from '../../stores/ProfileStore';
import actions from '../../actions/ProfileActions';

import NotificationModalContainer from './NotificationModalContainer';
import PlayModalContainer from './PlayModalContainer';

type PropsType = {
}

type StateType = {
  messages: Array<ModalMessage>,
  runningTournaments: Array,
}

export default class ModalContainer extends Component {
  state = {
    messages: [],
    runningTournaments: [],
  };

  componentWillMount() {
    store.addChangeListener(() => {
      console.warn('callback in store');
      this.setState({
        messages: store.getMyNews(),
        runningTournaments: store.getRunningTournaments(),

        money: store.getMoney(),
      });
    });
    actions.loadNews();
  }

  render(props: PropsType, state: StateType) {
    console.warn('render ModalContainer');
    if (state.runningTournaments.length) {
      console.warn('has running tournaments');
      const tournaments = state.runningTournaments
        .map((t) => {
          const id = t;
          return {
            tournamentID: id,
            gameUrl: store.getGameUrl(id),
          };
        });
      return <PlayModalContainer tournaments={tournaments} />;
    }

    const messages = state.messages;

    if (messages.length) {
      return <NotificationModalContainer message={messages[0]} count={messages.length} />;
    }

    // console.log('no modal');
    $('#modal-standard').modal('hide');
    return <div style="display: none;"></div>;
  }
}
