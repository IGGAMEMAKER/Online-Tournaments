import { h, Component } from 'preact';

type PropsType = {
  send: Function,
  messages: Array,
  canEnter: boolean,
}

type MessageType = {
  sender: string,
  text: string
}

type StateType = {
  messages: Array<MessageType>,
  text: string
};

export default class ChatPanel extends Component {
  state = {
    messages: [],
    text: ''
  };

  componentWillMount() {}

  componentWillReceiveProps() {
    // scroll messages here
    this.scrollToMessageEnd();
  }

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

  send = (props: PropsType) => {
    if (!props.canEnter) {
      return;
    }

    if (!props.send) {
      console.error('no send function in pros. ChatPanel');
      return;
    }

    const text = this.state.text;

    if (text) {
      props.send(text);
    }

    this.scrollToMessageEnd();
  };

  onEnter = (e) => {
    const KEY_CODE_ENTER = 13;
    if (e.keyCode === KEY_CODE_ENTER) {
      this.send(this.props);
    }
  };

  render(props: PropsType, state: StateType) {
    const messageList = props.messages
      .map((m: MessageType, i: number, arr: Array) => {
        if (!m) return '';
        let style = '';

        if (m.sender === login) {
          style = 'color: gold;';
        }

        const text = `${m.sender || 'Гость'}: ${m.text}`;

        if (i === arr.length - 1) {
          return <p id="chat" className="chat-text" style={style}>{text}</p>;
        }

        return <p className="chat-text" style={style}>{text}</p>;
      });

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
          onClick={this.send}
          style="margin-top: 10px;"
        >Отправить</button>
      </div>
    );
  }
}
