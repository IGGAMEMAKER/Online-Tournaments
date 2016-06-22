import { h, Component } from 'preact';
import Menu from '../components/Shared/Menu';
import socketListener from '../helpers/SocketListener';

import ModalContainer from '../components/Modal/ModalContainer';
import Chat from '../components/Activity/Chat';

type PropsType = {
  content: ?any,
  chat: Boolean,
}

type StateType = {}

export default class Layout extends Component {
  componentWillMount() {}

  render(props: PropsType, state: StateType) {
    const chat = props.chat ? <Chat /> : '';
    const modals = props.nomodals ? '' : <ModalContainer />;
    return (
      <div>
        <center>
          <Menu />
          {modals}
          <div>{props.content}</div>
          {chat}
        </center>
      </div>
    );
  }
}
