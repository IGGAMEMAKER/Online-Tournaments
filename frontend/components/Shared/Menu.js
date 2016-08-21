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
        points: store.getPoints(),
        loaded: true
      });
    });
  }

  render(props: PropsType, state: StateType) {
    let text = '';
    let levelText = '';
    const points = state.points;
    let nextLevelPoints = 1000; ///!!!!!!!!!!!!!!!!!!
    const level = 1;

    if (state.loaded) {
      text = `  На вашем счету ${state.money}p   : `;
      levelText = `Уровень ${level}. До следующего уровня: ${nextLevelPoints - points} XP`
    }

    // let loginMenu = <li><a href="/Login" className="light-blue">Вход</a></li>;
    let loginMenu = <a href="/Login" className="menu-link"><div className="menu-item">Вход</div></a>;

    if (login) {
      loginMenu = '';
    }

    const hover = 'menu-item'; //light-blue
    const menuTournaments = `${hover} ${props.active === 'Tournaments' ? 'active' : ''}`;
    const menuPacks = `${hover} ${props.active === 'Packs' ? 'active' : ''} hide`;
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
        <div className="balance">
          <span>{text}</span>
          <a href="/Profile#dep" onClick={stats.pressedMenuFulfill}>Пополнить</a>
          <span> / </span>
          <a href="/Profile#cashoutMoney" onClick={stats.pressedMenuCashout}>Снять</a>
        </div>
        <div className="points">
          <span>{levelText}&nbsp;</span>
          <a href="/Profile#dep" onClick={stats.pressedMenuFulfill}>Купить</a>
          <span> / </span>
          <a href="/Profile#cashoutMoney" onClick={stats.pressedMenuCashout}>Заработать</a>
        </div>
      </center>
    );

    const auth = (
      <center>
        <div className="balance">
          <a href="/Login">Войдите</a>
          <span>, чтобы начать играть!</span>
        </div>
      </center>
    );

    // <li><a href="/Packs" className={menuPacks}>Призы</a></li>

    const normal = (
      <div>
        <a href="/" className="menu-link">
          <div className={menuIndex}>Главная</div>
        </a>
        <a href="/Tournaments" className="menu-link">
          <div className={menuTournaments}>Турниры</div>
        </a>
        <a href="/Packs" className="menu-link">
          <div className={menuPacks}>Призы</div>
        </a>
        <a href="/Profile" className="menu-link">
          <div className={menuProfile}>Профиль</div>
        </a>
      </div>
    );

    const indexLink = <div className={menuIndex}>Главная</div>;
    const tournamentLink = <div className={menuTournaments}>Турниры</div>;
    const profileLink = <div className={menuProfile}>Профиль</div>;
    const packLink = <div className={menuPacks}>Призы</div>;

    return (
      <div className="menu-fixed-top">
        <div className="menu-container">
          <Link href="/" className="menu-link" content={indexLink} />
          <Link href="/Tournaments" className="menu-link" content={tournamentLink} />
          <Link href="/Packs" className="menu-link" content={packLink} />
          <Link href="/Profile" className="menu-link" content={profileLink} />
        </div>
        <div className="menu-balance-container">
          {login ? balance : auth}
        </div>
      </div>
    );

    return (
      <div className="menu-fixed-top">
        <div className="menu-container">
          <Link href="/" className={`${menuIndex}`} content="Главная" />
          <Link href="/Tournaments" className={menuTournaments} content="Турниры" />
          <Link href="/Profile" className={menuProfile} content="Профиль" />
        </div>
        <div className="menu-balance-container">
          {login ? balance : auth}
        </div>
      </div>
    );
    // {loginMenu}


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
