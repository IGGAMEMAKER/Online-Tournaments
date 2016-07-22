import { h, Component } from 'preact';
import store from '../../stores/ProfileStore';
import stats from '../../helpers/stats';
// import actions from '../../actions/ProfileActions';
import Link from './Link';

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
    // let loginMenu = <li><a href="/Login" className="light-blue">Вход</a></li>;
    let loginMenu = <a href="/Login" className="menu-item"><div className="menu-link">Вход</div></a>;

    if (login) {
      loginMenu = '';
    }

    const hover = 'menu-item'; //light-blue
    const menuTournaments = `${hover} ${props.active === 'Tournaments' ? 'active' : ''}`;
    const menuPacks = `${hover} ${props.active === 'Packs' ? 'active' : ''}`;
    const menuProfile = `${hover} ${props.active === 'Profile' ? 'active' : ''} ${login ? '' : 'hide'}`;
    const menuAbout = `${hover} ${props.active === 'About' ? 'active' : ''}`;
    const menuIndex = `${hover} ${props.active === 'Index' ? 'active' : ''}`;
    const menuChat = `${hover} ${props.active === 'Chat' ? 'active' : ''}`;

    //     font-size: 18px;
    // line-height: 20px;
    // <a href="/" className={`navbar-brand ${menuIndex}`}>Онлайн Турниры</a>

    // navbar-brand

    // <li><a href="/Packs" className={menuPacks}>Призы</a></li>
    // <li><a href="/Packs" className={menuPacks}>Призы</a></li>
    // collapse <div id="bs-example-navbar-collapse-1" className="navbar-collapse">

    const balance = (
      <center>
        <div style={`background-color:#111111; display: ${login ? 'block' : 'none'}`} className="balance">
          <span>{text}</span>
          <a href="/Profile#dep" onClick={stats.pressedMenuFulfill}>Пополнить</a>
          <span> / </span>
          <a href="/Profile#cashoutMoney" onClick={stats.pressedMenuCashout}>Снять</a>
        </div>
      </center>
    );

    // <li><a href="/Packs" className={menuPacks}>Призы</a></li>

    // <li><a href="/" className={`${menuIndex}`}>Главная</a></li>
    // <li><a href="/Tournaments" className={menuTournaments}>Турниры</a></li>
    // <li><a href="/Profile" className={menuProfile}>Профиль</a></li>

    const standardNav = (
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
            <li><Link href="/" className={`${menuIndex}`} text="Главная" /></li>
            <li><Link href="/Tournaments" className={menuTournaments} text="Турниры" /></li>
            <li><Link href="/Profile" className={menuProfile} text="Профиль" /></li>
            {loginMenu}
          </ul>
        </div>
      </div>
    );

    const previous = (
      <nav role="navigation" className="navbar navbar-inverse navbar-fixed-top navbar-my">
        <div className="container-fluid">
          {standardNav}
        </div>

        <div className="container-fluid">
          {balance}
        </div>
      </nav>
    );

    return (
      <div className="menu-fixed-top">
        <div className="menu-container">
          <a href="/" className="menu-link">
            <div className={menuIndex}>Главная</div>
          </a>
          <a href="/Tournaments" className="menu-link">
            <div className={menuTournaments}>Турниры</div>
          </a>
          <a href="/Profile" className="menu-link">
            <div className={menuProfile}>Профиль</div>
          </a>
          {loginMenu}
        </div>
      </div>
    );
    return previous;


    return (
      <nav className="navbar navbar-inverse navbar-fixed-top chat" role="navigation">
        <div className="container-fluid">
          <ul className="nav navbar-nav">
            <li><a href="/" className={`${menuIndex}`}>Главная</a></li>
            <li><a href="/Tournaments" className={menuTournaments}>Турниры</a></li>
            <li><a href="/Packs" className={menuPacks}>Призы</a></li>
            <li><a href="/Profile" className={menuProfile}>Профиль</a></li>
            {loginMenu}
          </ul>
        </div>
      </nav>
    );

    return (
      <center>
        <div className="container-fluid">
          <ul className="nav navbar-nav">
            <li><a href="/" className={`${menuIndex}`}>Главная</a></li>
            <li><a href="/Tournaments" className={menuTournaments}>Турниры</a></li>
            <li><a href="/Packs" className={menuPacks}>Призы</a></li>
            <li><a href="/Profile" className={menuProfile}>Профиль</a></li>
            {loginMenu}
          </ul>
        </div>

        <div className="container-fluid">
          {balance}
        </div>
      </center>
    );
  }
}
