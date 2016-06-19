import { h, Component } from 'preact';
import { ModalMessage } from '../types';
import request from 'superagent';

import * as c from '../../constants/constants';
// import io from 'socket.io-client';
import store from '../../stores/ProfileStore';
import actions from '../../actions/ProfileActions';
import PackCard from '../Packs/PackCard';

import Modal from './Modal';
import ModalDrawer from './ModalDrawer';
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

type TournamentStartType = {
  tournamentID: number,
  gameName: number,
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
    actions.loadNews();
  }

  skip = (text: string, id) => {
    // console.log('skip', text, id);
  };

  sendError = (err, name) => {
    console.log('sendError in modal', name, err);
  };

  modal_pic = (name) => {
    console.log('modal_pic', name);
    return <div><br /><img alt="" style="width:100%" src={`/img/${name}`} /></div>;
  };

  hide = () => {
    // $("#modal-standard").modal('hide');
    this.setState({ visible: false });
  };

  winningPicture = () => this.modal_pic('win_1.png');

  ratingPicture = () => this.modal_pic('win_2.jpg');

  losePicture = () => this.modal_pic('lose_1.jpg');

  answer = (code, messageID) => {
    request.get(`message/action/${code}/${messageID}`);
    this.hide();
  };

  buttons = {
    action: (code, messageID, style) => {
      return <a className="btn btn-primary" onClick={this.answer(code, messageID)}>{style.text}</a>;
    },
  };

  drawPlayButton = (host, port, tournamentID) => {
    var addr = `http://${host}:${port}/Game?tournamentID=${tournamentID}`;
    return (
      <form id="form1" method="post" action={addr}>
        <input type="hidden" name="login" value="'+login+'" />
        <input
          type="submit"
          className="btn btn-primary btn-lg"
          value={`Сыграть в турнир #${tournamentID}`}
        />
      </form>
    );
  };

  drawPlayButtons = (tournaments: Array<TournamentStartType>) => {
    return tournaments.map((t) => {
      const host = 'localhost';
      const port = '5010';

      return this.drawPlayButton(host, port, t.tournamentID);
    });
  };

  modal = (id, status) => {
    $(id).modal(status ? 'show' : 'hide');
    // {$("#modal-standard").modal(state.visible ? 'show' : 'hide')}
  };

  playModal = (status) => {
    this.modal('#modal-standard', status);
  };

  render(props: PropsType, state: StateType) {
    let header = '';
    let body = '';
    let footer = '';
    let messageID;
    let count;

    let invisible;

    // let title = '';
    if (state.runningTournaments.length) {
      return <PlayModalContainer tournaments={state.runningTournaments} />;
    }

    console.log('try region after runnings');
    const messages = state.messages;
    count = messages.length;

    if (count > 0) {
      const message = messages[0];
      return <ModalDrawer message={message} count={count} />;

      // const data = message.data || {};
      // messageID = message["_id"] || 0;
      //
      // const modalData = this.getModalData(message, data, messageID, state);
      // header = modalData.header;
      // body = modalData.body;
      // footer = modalData.footer;
    } else {
      console.warn('no messages here');
      return '';
    }

    // const data = {
    //   messageID,
    //   header,
    //   body,
    //   footer,
    //   count,
    // };

    // if (!state.messages.length) {
    //   console.error('INVISIBLE REGION. WHY?', state.messages.length, invisible);
    //   return '';
    // }

    // return <Modal data={{data}} />;

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
