import { h, Component } from 'preact';
import request from 'superagent';
import store from '../../stores/ProfileStore';
import actions from '../../actions/ProfileActions';

type PropsType = {};

type MessageType = {
  sender: string,
  text: string,
}

type StateType = {
  messages: Array<MessageType>,
  text: string,
};

type ResponseType = {
  body: {
    msg: Array<MessageType>,
  }
};

export default class Chat extends Component {
  state = {
    messages: [],
    text: '',
  };

  componentWillMount() {
    store.addChangeListener(() => {
      this.setState({
        messages: store.getChatMessages(),
      });
    });
    this.loadMessages();
  }

  appendMessage = (sender, text) => {
    // $("#messages").append($("<p>").text(login + " : " + text));
    this.scrollToMessageEnd();
    const messages = this.state.messages;
    messages.push({ sender, text });
    this.setMessages(messages);
  };

  setMessages = (messages) => {
    this.setState({ messages });
  };

  loadMessages = () => {
    actions.loadChatMessages();
    setTimeout(this.scrollToMessageEnd, 100);
    // setAsync('/messages/chat/recent', {}, this.drawMessages)

    // request
    //   .post('/messages/chat/recent')
    //   .end((err, res: ResponseType) => {
    //     const messages = res.body.msg
    //       .reverse()
    //       .map(item => {
    //         return { sender: item.senderName, text: item.text };
    //       });
    //     this.setMessages(messages);
    //     this.scrollToMessageEnd();
    //   });
  };

  scrollToMessageEnd = () => {
    setTimeout(() => {
      const elem = document.getElementById('messages');
      elem.scrollTop = elem.scrollHeight;
    }, 100);
  };

  getText = () => {
    const text = document.getElementById('m').value;
    console.log(text);
    this.setState({ text });
  };

  sendMessage = () => {
    // console.log('sendMessage');
    const text = this.state.text;
    this.scrollToMessageEnd();
    if (!text) return;

    // actions.sendMessage(text, login || 'nil');
    // this.state.socket.emit('chat message', { text, login });
    socket.emit('chat message', { text, login });
    this.setState({ text: '' });
  };

  onEnter = (e) => {
    const KEY_CODE_ENTER = 13;
    if (e.keyCode === KEY_CODE_ENTER) {
      this.sendMessage();
    }
  };

  render(props: PropsType, state: StateType) {
    const messageList = state.messages
      .map((m: MessageType, i: number, arr: Array) => {
        let style = '';
        if (m.sender === login) {
          style = 'color: gold;';
        }
        if (i === arr.length - 1) {
          return <p id="chat" className="chat-text" style={style}>{m.sender}: {m.text}</p>;
        }
        return <p className="chat-text" style={style}>{m.sender}: {m.text}</p>;
      });
    /*
      <link rel="stylesheet" type="text/css" href="/css/chat1.css" />
    */
    return (
      <div className="full" style="max-width: 600px;">
        <h2 className="page">Чат</h2>
        <ul id="messages" style="max-height:300px; overflow:auto;">
          {messageList}
        </ul>
        <input
          id="m"
          className="circle-input full"
          style=""
          autoComplete="off"
          onInput={this.getText}
          onKeyDown={this.onEnter}
          value={state.text}
        >{state.text}</input>
        <br />
        <button
          className="btn btn-primary btn-lg"
          onClick={this.sendMessage}
          style="margin-top: 10px;"
        >Отправить</button>
      </div>
    );
  }
}
