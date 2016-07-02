import { h, Component } from 'preact';
import store from '../../stores/ProfileStore';

type PropsType = {}

type StateType = {
  loaded: boolean,
}

export default class Footer extends Component {
  state = {
    loaded: false,
  };

  componentWillMount() {
    store.addChangeListener(() => {
      this.setState({
        messages: store.getChatMessages(),
        loaded: true,
      });
    });
  }

  render(props: PropsType, state: StateType) {
    let chat = '';
    if (state.loaded && state.messages.length) {
      const m = state.messages[state.messages.length - 1];
      chat = <a href="#chat">{m.sender || 'Гость'}: {m.text}</a>;
    }
    //
    // <li>
    //   <a href="/about"> auth()</a>
    // </li>

    /*
     <li>
     <a className="fa fa-vk fa-lg" href="https://vk.com/o_tournaments" target="_blank"> Группа ВК</a>
     </li>
     <li>
     <a href="https://vk.com/topic-111187123_33419618" target="_blank"> Техподдержка</a>
     </li>
     <li>
     <a href="/about"> О нас</a>
     </li>

     */

    /*

     <button
     type="button"
     className="navbar-toggle"
     data-toggle="collapse"
     data-target="#bs-example-navbar-collapse-2"
     >
     <span className="sr-only"> Toggle navigation</span>
     <span className="icon-bar" />
     <span className="icon-bar" />
     <span className="icon-bar" />
     </button>

     */
    return (
      <center>
        <div style="height: 35px;"></div>
        <center>
          <div style="width: 150px; float: left;">
            <a
              href="https://vk.com/o_tournaments"
              className="fa fa-vk fa-lg"
              target="_blank"
            >Группа ВК</a>
          </div>
          <div style="width: 100px; float: left;">
            <a
              href="https://vk.com/topic-111187123_33419618"
              target="_blank"
            >Техподдержка</a>
          </div>
          <div style="width: 100px; float: left;">
            <a href="/about"> О нас</a>
          </div>
        </center>
        <div style="height: 35px;"></div>
        <nav className="navbar navbar-inverse navbar-fixed-bottom" role="navigation">
          <div className="container-fluid">
            <div className="navbar-header">
              <p className="navbar-brand" id="activity">{chat}</p>
            </div>
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-2">
              <ul className="nav navbar-nav navbar-right">
              </ul>
            </div>
          </div>
        </nav>
      </center>
    );
  }
}
