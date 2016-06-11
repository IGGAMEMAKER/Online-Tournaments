import { h, Component } from 'preact';
import request from 'superagent';

type PropsType = {};

type MessageType = {
  sender: string,
  text: string,
}

type StateType = {
  messages: Array<MessageType>,
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

    const socket = io();
    socket.on('chat message', (msg) => {
      this.appendMessage(msg.sender, msg.text);
    });
    this.setState({ socket });
  }

  appendMessage = (sender, text) => {
    // $("#messages").append($("<p>").text(login + " : " + text));
    // this.scrollToMessageEnd();
    const messages = this.state.messages;
    messages.push({ sender, text });
    this.setState({ messages });
  };

  // drawMessages = (msg) => {
  //   console.log("drawMSGGGGGG");
  //   console.log(msg);
  //   var messages = msg.msg;
  //   for (var i= messages.length-1; i>= 0; i--){
  //     var m = messages[i];
  //     this.appendMessage(m.senderName, m.text);
  //   }
  //   this.scrollToMessageEnd()
  // };

  loadMessages = () => {
    // setAsync('/messages/chat/recent', {}, this.drawMessages)
    request
      .post('/messages/chat/recent')
      .end((err, res: ResponseType) => {
        const messages = res.body.msg.map(item => {
          return { sender: item.senderName, text: item.text };
        });
        this.setState({ messages });
      });
  };

  // scrollToMessageEnd = () => {
  //   var elem = document.getElementById("messages");
  //   elem.scrollTop = elem.scrollHeight;
  // };

  getText = () => {
    const text = document.getElementById('m').value;
    this.setState({ text });
  };

  sendMessage = () => {
    console.log('sendMessage');
  };

  render(props: PropsType, state: StateType) {
    const messageList = state.messages.map((m: MessageType) => {
      return <p>{m.sender} : {m.text}</p>;
    });

    return (
      <div>
        <link rel="stylesheet/css" src="/css/chat.css" />
        <ul id="messages" style="max-height:500px; overflow:auto;">
          {messageList}
        </ul>
        <form action="">
          <input id="m" autoComplete="off" onChange={this.getText} />
          <button onClick={this.sendMessage}>Отправить</button>
        </form>
      </div>
    );
  }
}
