import { h, Component } from 'preact';
import request from 'superagent';

type PropsType = {};

type MessageType = {
  sender: string,
  text: string,
}

type StateType = {
  messages: Array<MessageType>,
  text: string,
  socket: Object,
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
    socket: '',
  };

  componentWillMount() {
    this.loadMessages();

    const socket1 = io();
    socket1.on('chat message', (msg) => {
      this.appendMessage(msg.sender, msg.text);
    });
    this.setState({ socket: socket1 });
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
    // setAsync('/messages/chat/recent', {}, this.drawMessages)
    request
      .post('/messages/chat/recent')
      .end((err, res: ResponseType) => {
        const messages = res.body.msg
          .reverse()
          .map(item => {
            return { sender: item.senderName, text: item.text };
          });
        this.setMessages(messages);
        this.scrollToMessageEnd();
      });
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
    this.state.socket.emit('chat message', { text, login });
    this.setState({ text: '' });
    // $("#m").val("");
  };

  onEnter = (e) => {
    const KEY_CODE_ENTER = 13;
    if (e.keyCode === KEY_CODE_ENTER) {
      this.sendMessage();
    }
  };

  render(props: PropsType, state: StateType) {
    const messageList = state.messages
      .map((m: MessageType) => {
        return <p style="color: white;">{m.sender} : {m.text}</p>;
      });
    /*
      <link rel="stylesheet" type="text/css" href="/css/chat1.css" />
    */
    return (
      <div style="width: 100%">
        <ul id="messages" style="max-height:300px; overflow:auto;">
          {messageList}
        </ul>
        <input
          id="m"
          className="circle-input"
          autoComplete="off"
          onInput={this.getText}
          onKeyDown={this.onEnter}
          value={state.text}
        >{state.text}</input>
        <button className="btn btn-primary btn-lg" onClick={this.sendMessage}>Отправить</button>
      </div>
    );
  }
}
