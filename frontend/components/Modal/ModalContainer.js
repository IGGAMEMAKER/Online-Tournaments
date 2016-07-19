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
    runningTournaments: []
  };

  componentWillMount() {
    store.addChangeListener(() => {
      this.setState({
        messages: store.getMyNews(),
        runningTournaments: store.getRunningTournaments(),

        money: store.getMoney()
      });
    });

    actions.loadNews();
  }

  render(props: PropsType, state: StateType) {
    if (state.runningTournaments.length) {
      console.warn('has running tournaments');
      const tournaments = state.runningTournaments
        .map(tournamentID => {
          return {
            tournamentID,
            gameUrl: store.getGameUrl(tournamentID)
          };
        });
      return <PlayModalContainer tournaments={tournaments} />;
    }

    const messages = state.messages;

    if (messages.length) {
      return <NotificationModalContainer message={messages[0]} count={messages.length} />;
    }

    // $('#modal-standard').modal('hide');
    // return <div style="display: none;"></div>;
    return '';
  }
}
