import { h, Component } from 'preact';
import { ModalMessage } from '../types';
import request from 'superagent';

// import * as c from '../../constants/constants';
// import io from 'socket.io-client';
import store from '../../stores/ProfileStore';
import actions from '../../actions/ProfileActions';

import NotificationModalContainer from './NotificationModalContainer';
import PlayModalContainer from './PlayModalContainer';

type PropsType = {
}

type StateType = {
  visible: boolean,
  messages: Array<ModalMessage>,
  runningTournaments: Array,
}

// type ResponseType = {
//   body: {
//     msg: Array<ModalMessage>,
//   }
// }

export default class ModalContainer extends Component {
  state = {
    visible: false,

    tournaments: {},
    registeredIn: {},
    messages: [],

    runningTournaments: [],
  };

  componentWillMount() {
    store.addChangeListener(() => {
      // console.log('addChangeListener in ModalContainer',
      //   store.hasRunningTournaments(),
      //   store.getRunningTournaments()
      // );
      this.setState({
        messages: store.getMyNews(),
        visible: store.hasNews() || store.hasRunningTournaments(),
        runningTournaments: store.getRunningTournaments(),

        money: store.getMoney(),
      });
    });

    actions.loadNews();
    // actions.initialize();

    // setInterval(() => {
    //   console.log('logging running tournaments...',
    //     store.getRunningTournaments(),
    //     store.getMyTournaments(),
    //     this.state.runningTournaments,
    //     this.state.tournaments,
    //   );
    // }, 3000);
  }

  // skip = (text: string, id) => {
  //   // console.log('skip', text, id);
  // };

  // sendError = (err, name) => {
  //   console.log('sendError in modal', name, err);
  // };
  //
  // hide = () => {
  //   // $("#modal-standard").modal('hide');
  //   this.setState({ visible: false });
  // };
  //
  // answer = (code, messageID) => {
  //   request.get(`message/action/${code}/${messageID}`);
  //   this.hide();
  // };
  //
  // buttons = {
  //   action: (code, messageID, style) => {
  //     return <a className="btn btn-primary" onClick={this.answer(code, messageID)}>{style.text}</a>;
  //   },
  // };

  render(props: PropsType, state: StateType) {
    console.warn('render ModalContainer');

    if (state.runningTournaments.length) {
      console.log('running tournaments modal');
      const tournaments = state.runningTournaments
        .map((t) => {
          const id = t;
          console.log('run map ttttt', t, id);
          return {
            tournamentID: id,
            gameUrl: store.getGameUrl(id),
          };
        });
      return <PlayModalContainer tournaments={tournaments} />;
    }

    const messages = state.messages;
    const count = messages.length;

    if (count > 0) {
      console.log('notifications modal');
      return <NotificationModalContainer message={messages[0]} count={count} />;
    }

    console.log('no modal');
    return '';
  }
}
