import { h, Component } from 'preact';
import Menu from '../components/Shared/Menu';
import Footer from '../components/Shared/Footer';
import socketListener from '../helpers/SocketListener';

import ModalContainer from '../components/Modal/ModalContainer';
import Chat from '../components/Activity/Chat';

import InfoActions from '../actions/InfoActions';
import ProfileActions from '../actions/ProfileActions';

type PropsType = {
  content: ?any,
  chat: Boolean,
  active: string,
}

type StateType = {}

export default class Layout extends Component {
  componentWillMount() {
    InfoActions.getAvailablePacks();
    InfoActions.getGifts();

    ProfileActions.initialize();
    ProfileActions.online();
  }

  render(props: PropsType, state: StateType) {
    const chat = !props.chat ? '' : <Chat />;
    const header = props.noheader ? '' : <Menu active={props.active || ''} />;
    const modals = props.nomodals ? '' : <ModalContainer />;
    const footer = props.nofooter ? '' : <Footer />;
    return (
      <div>
        <center>
          <div className="center" style="overflow: hidden; height: auto">
            {header}
          </div>
          {modals}
          <div className="center" style="overflow: hidden; height: auto">
            <br />
            {props.content}
          </div>
          <div className="center offset" style="overflow: hidden; height: auto">
            {footer}
          </div>
        </center>
      </div>
    );
  }
}
