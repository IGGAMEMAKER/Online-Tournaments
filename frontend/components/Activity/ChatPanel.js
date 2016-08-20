import { h, Component } from 'preact';

type PropsType = {
  send: Function,
  messages: Array,
  preventSend: boolean,
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

  componentWillMount() {
    this.scrollToMessageEnd();
  }

  messagesUpdated = (prev, now) => {
    return prev.length !== now.length;
    return prev[0].text !== now[0].text;
  };

  shouldComponentUpdate(nextProps: PropsType, nextState: StateType) {
    // return true;
    return this.messagesUpdated(this.props.messages, nextProps.messages)
    || this.state.text != nextState.text;
  }
  componentDidUpdate() {
    // console.log('componentWillUpdate');
    this.scrollToMessageEnd();
  }
  // componentWillReceiveProps() {
  //   // scroll messages here
  //   console.log('componentWillReceiveProps');
  //   this.scrollToMessageEnd();
  // }

  scrollToMessageEnd = () => {
    setTimeout(() => {
      // console.log('scrollToMessageEnd');
      const elem = document.getElementById('messages');
      elem.scrollTop = elem.scrollHeight;
    }, 100);
  };

  getText = () => {
    const text = document.getElementById('m').value;
    // console.log(text);
    this.setState({ text });
  };

  send = (props: PropsType) => {
    if (props.preventSend) {
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

    this.setState({ text: '' });
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
        console.log(m);
        const text = `${m.sender || m.senderName || 'Гость'}: ${m.text}`;

        let chatText;
        if (i === arr.length - 1) {
          chatText = <p id="chat" className="chat-text" style={style}>{text}</p>;
        } else {
          chatText = <p className="chat-text" style={style}>{text}</p>;
        }

        //             <hr />
        return (
          <div>
            {chatText}
          </div>
        )
      });
    // console.log('render');
    return (
      <div className="full" style="max-width: 600px;">
        <h2 className="page">{props.title || "Чат"}</h2>
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
        />
        <br />
        <button
          className="btn btn-primary btn-lg"
          onClick={() => { this.send(props); }}
          style="margin-top: 10px;"
        >Отправить</button>
      </div>
    );
  }
}
