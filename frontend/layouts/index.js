import { h, Component } from 'preact';
import Menu from '../components/Shared/Menu';
import Footer from '../components/Shared/Footer';
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
    const header = props.noheader ? '' : <Menu />;
    const chat = props.chat ? <Chat /> : '';
    const modals = props.nomodals ? '' : <ModalContainer />;
    const footer = props.nofooter ? '' : <Footer />;
    return (
      <div>
        <center>
          {header}
          {modals}
          <div>{props.content}</div>
          {chat}
          {footer}
        </center>
      </div>
    );
  }
}
