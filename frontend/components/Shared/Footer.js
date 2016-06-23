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
    if (state.loaded) {
      const m = state.messages[state.messages.length - 1];
      chat = <a href="#chat">{m.sender}: {m.text}</a>;
    }
    //
    // <li>
    //   <a href="/about"> auth()</a>
    // </li>
    return (
      <center>
        <div style="height: 35px;"></div>
        <nav className="navbar navbar-inverse navbar-fixed-bottom" role="navigation">
          <div className="container-fluid">
            <div className="navbar-header">
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
              <p className="navbar-brand" id="activity">{chat}</p>
            </div>
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-2">
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <a className="fa fa-vk fa-lg" href="https://vk.com/o_tournaments" target="_blank"> Группа ВК</a>
                </li>
                <li>
                  <a href="https://vk.com/topic-111187123_33419618" target="_blank"> Техподдержка</a>
                </li>
                <li>
                  <a href="/about"> О нас</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </center>
    );
  }
}
