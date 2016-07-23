import { h, Component } from 'preact';
import store from '../../stores/ProfileStore';
import actions from '../../actions/ProfileActions';
import ChatPanel from './ChatPanel';

type PropsType = {
  support: boolean
};

type MessageType = {
  sender: string,
  text: string
}

type StateType = {
  messages: Array<MessageType>,
  text: string
};

export default class Chat extends Component {
  state = {
    messages: []
  };

  componentWillMount() {
    store.addChangeListener(() => {
      this.setState({
        messages: store.getChatMessages()
      });
    });

    actions.loadChatMessages();
  }

  sendMessage = (text) => {
    socket.emit('chat message', { text, login });
  };

  render(props: PropsType, state: StateType) {
    return (
      <ChatPanel messages={state.messages} send={this.sendMessage} title="Чат" />
    );
  }
}
