import { h, Component } from 'preact';
import { ModalMessage } from '../types';
import request from 'superagent';

import * as c from '../../constants/constants';
// import io from 'socket.io-client';
import store from '../../stores/ProfileStore';
import actions from '../../actions/ProfileActions';
import PackCard from '../Packs/PackCard';

import NotificationModalContainer from './NotificationModalContainer';
import PlayModalContainer from './PlayModalContainer';

type PropsType = {
}

type StateType = {
  visible: boolean,
  messages: Array<ModalMessage>,
  runningTournaments: Array,
}

type ResponseType = {
  body: {
    msg: Array<ModalMessage>,
  }
}

export default class ModalContainer extends Component {
  state = {
    visible: false,

    tournaments: {},
    registeredIn: {},
    messages: [],

    runningTournaments: [],
  };

  componentWillMount() {
    store.addChangeListener(() => {
      this.setState({
        messages: store.getMyNews(),
        visible: store.hasNews() || store.hasRunningTournaments(),
        runningTournaments: store.getRunningTournaments(),

        money: store.getMoney(),
      });
    });
    setInterval(() => {
      actions.loadNews();
      actions.initialize();
    }, 3000);
  }

  skip = (text: string, id) => {
    // console.log('skip', text, id);
  };

  sendError = (err, name) => {
    console.log('sendError in modal', name, err);
  };

  hide = () => {
    // $("#modal-standard").modal('hide');
    this.setState({ visible: false });
  };

  answer = (code, messageID) => {
    request.get(`message/action/${code}/${messageID}`);
    this.hide();
  };

  buttons = {
    action: (code, messageID, style) => {
      return <a className="btn btn-primary" onClick={this.answer(code, messageID)}>{style.text}</a>;
    },
  };

  render(props: PropsType, state: StateType) {
    if (state.runningTournaments.length) {
      console.log('running tournaments modal');
      return <PlayModalContainer tournaments={state.runningTournaments} />;
    }

    const messages = state.messages;
    const count = messages.length;

    if (count > 0) {
      console.log('notifications modal');
      return <NotificationModalContainer message={messages[0]} count={count} />;
    }

    console.log('no modal');
    return '';

    // return (
    //   <div>
    //     <button
    //       type="button"
    //       className="btn btn-info btn-lg"
    //       data-toggle="modal"
    //       data-target="#myModal"
    //     >Open Modal</button>
    //     <div id="myModal" className="modal fade" role="dialog">
    //       <div className="modal-dialog">
    //         <div className="modal-content">
    //           <div className="modal-header">
    //             <button type="button" className="close" data-dismiss="modal">&times;</button>
    //             <h4 className="modal-title">Modal Header</h4>
    //           </div>
    //           <div className="modal-body">
    //             <p>Some text in the modal.</p>
    //           </div>
    //           <div className="modal-footer">
    //             <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // );
  }
}
