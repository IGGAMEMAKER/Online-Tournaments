import { h, Component } from 'preact';
import store from '../../stores/ProfileStore';
import actions from '../../actions/ProfileActions';
import ChatPanel from './ChatPanel';

type PropsType = {
};

type MessageType = {
  sender: string,
  text: string
}

type StateType = {
  messages: Array<MessageType>
};

export default class Support extends Component {
  state = {
    messages: []
  };

  componentWillMount() {
    store.addChangeListener(() => {
      this.setState({
        messages: store.getSupportMessages()
      });
    });

    actions.loadSupportMessages();
    actions.initialize();
  }

  sendMessage = (text) => {
    if (login) {
      socket.emit('support', { text, login });
      actions.loadSupportMessages();
    }
  };

  render(props: PropsType, state: StateType) {
    return (
      <ChatPanel messages={state.messages} send={this.sendMessage} preventSend={!login} title="Техподдержка" />
    );
  }
}
