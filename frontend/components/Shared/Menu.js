import { h, Component } from 'preact';
import store from '../../stores/ProfileStore';
import stats from '../../helpers/stats';
// import actions from '../../actions/ProfileActions';

type PropsType = {}

type StateType = {
  money: number,
  loaded: boolean,
}

export default class Menu extends Component {
  state = {
    loaded: false,
  };

  componentWillMount() {
    store.addChangeListener(() => {
      // console.warn('callback in store');
      this.setState({
        money: store.getMoney(),
        loaded: true,
      });
    });
  }

  render(props: PropsType, state: StateType) {
    const text = `  На вашем счету ${state.money}p   : `;
    const loginMenu = login ? '' : <li><a href="/Login" className="light-blue">Вход</a></li>;
    return (
      <center>
        <nav role="navigation" className="navbar navbar-inverse navbar-fixed-top navbar-my">
          <div className="container-fluid">
            <div style="margin: auto;">
              <div className="navbar-header">
                <button
                  type="button"
                  data-toggle="collapse"
                  data-target="#bs-example-navbar-collapse-1"
                  className="navbar-toggle"
                >
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar" />
                  <span className="icon-bar" />
                  <span className="icon-bar" />
                </button>
                <a href="/" className="navbar-brand light-blue">Онлайн Турниры</a>
              </div>
              <div id="bs-example-navbar-collapse-1" className="collapse navbar-collapse">
                <ul className="nav navbar-nav navbar-left">
                  <li><a href="/Tournaments" className="light-blue">Турниры</a></li>
                  <li><a href="/Packs" className="light-blue">Призы</a></li>
                  <li><a href="/profile" className="light-blue">Профиль</a></li>
                  <li><a href="/about" className="light-blue"> О нас</a></li>
                  {loginMenu}
                </ul>
              </div>
            </div>
          </div>
          <div className="container-fluid">
            <center>
              <div style="width:100%; background-color:#111111;" className="balance">
                <span>{state.loaded ? text : ''}</span>
                <a href="/Profile#dep" onClick={stats.pressedMenuFulfill}>Пополнить</a>
                <span> / </span>
                <a href="/Profile#cashoutMoney">Снять</a>
              </div>
            </center>
          </div>
          <div className="container-fluid">
            <center>
              <div style="width:100%; background-color:#222;" className="balance"></div>
            </center>
          </div>
        </nav>
      </center>
    );
  }
}
