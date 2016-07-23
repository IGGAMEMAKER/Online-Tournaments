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

export default class Chat extends Component {
  state = {
    messages: []
  };

  componentWillMount() {
    store.addChangeListener(() => {
      console.log('Chat addChangeListener');
      this.setState({
        messages: store.getSupportMessages()
      });
    });

    actions.loadSupportMessages();
  }

  sendMessage = (text) => {
    socket.emit('support', { text, login });
  };

  render(props: PropsType, state: StateType) {
    return (
      <ChatPanel messages={state.messages} send={this.sendMessage} />
    );
  }
}
