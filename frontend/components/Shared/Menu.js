import { h, Component } from 'preact';
import store from '../../stores/ProfileStore';
import stats from '../../helpers/stats';
// import actions from '../../actions/ProfileActions';

type PropsType = {
  active: string,
}

type StateType = {
  money: number,
  loaded: boolean,
}

export default class Menu extends Component {
  state = {
    loaded: false
  };

  componentWillMount() {
    store.addChangeListener(() => {
      // console.warn('callback in store');
      this.setState({
        money: store.getMoney(),
        loaded: true
      });
    });
  }

  render(props: PropsType, state: StateType) {
    const text = state.loaded ? `  На вашем счету ${state.money}p   : ` : '';
    let loginMenu = <li><a href="/Login" className="light-blue">Вход</a></li>;

    if (login) {
      loginMenu = '';
    }

    const hover = ''; //light-blue
    const menuTournaments = `${hover} ${props.active === 'Tournaments' ? 'active' : ''}`;
    const menuPacks = `${hover} ${props.active === 'Packs' ? 'active' : ''}`;
    const menuProfile = `${hover} ${props.active === 'Profile' ? 'active' : ''}`;
    const menuAbout = `${hover} ${props.active === 'About' ? 'active' : ''}`;
    const menuIndex = `${hover} ${props.active === 'Index' ? 'active' : ''}`;
    const menuChat = `${hover} ${props.active === 'Chat' ? 'active' : ''}`;

    //     font-size: 18px;
    // line-height: 20px;
    // <a href="/" className={`navbar-brand ${menuIndex}`}>Онлайн Турниры</a>

    // navbar-brand

    // <li><a href="/Packs" className={menuPacks}>Призы</a></li>
    // <li><a href="/Packs" className={menuPacks}>Призы</a></li>
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

              </div>
              <div id="bs-example-navbar-collapse-1" className="collapse navbar-collapse">
                <ul className="nav navbar-nav">
                  <li><a href="/" className={`${menuIndex}`}>Главная</a></li>
                  <li><a href="/Tournaments" className={menuTournaments}>Турниры</a></li>
                  <li><a href="/Profile" className={menuProfile}>Профиль</a></li>
                  <li><a href="/Chat" className={menuChat}>Чат</a></li>
                  {loginMenu}
                </ul>
              </div>
            </div>
          </div>
          <div className="container-fluid">
            <center>
              <div style={`background-color:#111111; display: ${login ? 'block' : 'none'}`} className="balance">
                <span>{text}</span>
                <a href="/Profile#dep" onClick={stats.pressedMenuFulfill}>Пополнить</a>
                <span> / </span>
                <a href="/Profile#cashoutMoney" onClick={stats.pressedMenuCashout}>Снять</a>
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
