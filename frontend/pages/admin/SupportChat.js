import { h, Component } from 'preact';
import ChatPanel from '../../components/Activity/ChatPanel';
import request from 'superagent';

type PropsType = {
  senderName: string
};

type MessageType = {
  sender: string,
  text: string
}

type StateType = {
  messages: Array<MessageType>
};

export default class SupportChat extends Component {
  state = {
    messages: []
  };

  async getMessages(user) {
    const response = await request.get(`/messages/support/${user}`);

    this.setState({ messages: response.body.msg });
  };

  componentWillMount() {
    this.getMessages(this.props.senderName);
    // actions.loadSupportMessages();
    // actions.initialize();
  }

  sendMessage = (text) => {
    const user = this.props.senderName;
    request
      .post('/messages/support-respond')
      .send({ text, target: user })
      .end((err, response) => {
      });
    // socket.emit('support', { text, login });
    // actions.loadSupportMessages();
    this.getMessages(this.props.senderName)
  };

  render(props: PropsType, state: StateType) {
    const messages = state.messages.reverse();
    return (
      <div>
        <a
          onClick={() => { this.getMessages(props.senderName); }}
        >Обновить</a>
        <a href="/admin/support" className="btn btn-primary">Назад к диалогам</a>
        <ChatPanel messages={messages} send={this.sendMessage} title={`Техподдержка с ${props.senderName}`} />
      </div>
    );
  }
}
