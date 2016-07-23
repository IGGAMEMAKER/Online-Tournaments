import { h, Component } from 'preact';
import store from '../../stores/ProfileStore';
import AdvancedCard from './AdvancedCard';
import { Link } from 'preact-router';

type PropsType = {}

type StateType = {
  loaded: boolean,
}

export default class Footer extends Component {
  state = {
    loaded: false,
    vk: true
  };

  arraysEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.

    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  componentWillMount() {
    store.addChangeListener(() => {
      // if (!this.arraysEqual(this.state.messages, store.getChatMessages())) {
      this.setState({
        messages: store.getChatMessages(),
        loaded: true
      });
      // }
    });
    // VK.Widgets.Group('vk_groups', {
    //   mode: 2,
    //   width: '300',
    //   height: '360',
    //   color1: 'FFFFFF',
    //   color2: '2B587A',
    //   color3: '5B7FA6'
    // }, 111187123);
  }
  // toggleVK = () => {
  //   this.setState({ vk: !this.state.vk });
  // };

  getfooterLink = (link, text = 'Перейти', blank) => {
        // className="btn btn-primary btn-large btn-lg btn-fixed"
    // return <Link href={link} >{text}</Link>;
    return (
      <a
        className="footer-link"
        href={link}
        target={blank ? '_blank' : ''}
      >{text}</a>
    );
  };

  render(props: PropsType, state: StateType) {
    let chat = '';

    if (state.loaded && state.messages.length) {
      const m = state.messages[state.messages.length - 1];

      chat = (
        <div className="text-center">
          ЧАТ - &nbsp;
          {m.sender || 'Гость'}: {m.text}
        </div>
      );
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

          <script>
            console.log('script VK')
            const options = {};
            options.mode = 2;
            options.width = "auto";
            options.height = "360";
            options.color1 = 'FFFFFF';
            options.color2 = '2B587A';
            options.color3 = '5B7FA6';
            console.log(VK);
            VK.Widgets.Group("vk_groups", options, 111187123);
          </script>
     */

    // <div id="vk_groups" className={`${state.vk ? 'show' : 'hide'}`}></div>
    // <a className="fa fa-vk fa-lg" onClick={this.toggleVK}>Группа ВК</a>

    const supportLink = 'https://vk.com/topic-111187123_33419618';
    const groupLink = 'https://vk.com/o_tournaments';

    const groupButton = this.getfooterLink(groupLink, 'Группа ВК', true);
    const supportButton = this.getfooterLink(supportLink, 'Сообщить об ошибке', true);
    const siteSupportButton = this.getfooterLink('/Support', 'Техподдержка', false);
    const aboutButton = this.getfooterLink('/About', 'О нас', false);

    // const contacts = (
    //   <div className="white page">
    //     <div className="offset text-center contacts-tab">
    //       <AdvancedCard button={groupButton} title="Наша группа ВК" info={[vkText]} color="green" />
    //     </div>
    //     <div className="offset text-center contacts-tab">
    //       <AdvancedCard button={supportButton} title="Техподдержка" info={[supportText]} color="green" />
    //     </div>
    //   </div>
    // );

    // <AdvancedCard button={''} type="big" color="purple" title="Контакты" />
    const siteSupport = (
      <div style={`display: ${login ? 'inline-block' : 'none'}`}>
        <div className="footer-divider">|</div>
        {siteSupportButton}
      </div>
    );

    // <div className="footer-divider">|</div>
    // {siteSupportButton}
    const contacts = (
      <div className="white">
        {groupButton}
        <div className="footer-divider">|</div>
        {supportButton}
        {siteSupport}
        <div className="footer-divider">|</div>
        {aboutButton}
      </div>
      // <div className="center offset-lg">
      // </div>
    );

    // return (
    //   <div className="center">
    //     <h1 className="white page">Контакты</h1>
    //     {contacts}
    //     <div style="height: 60px;"></div>
    //     <nav className="navbar navbar-inverse navbar-fixed-bottom chat" role="navigation">
    //       <div className="container-fluid">
    //         <div className="navbar-header">
    //           <p id="activity">{chat}</p>
    //         </div>
    //       </div>
    //     </nav>
    //   </div>
    // );

    // const chatClassName = "navbar navbar-inverse navbar-fixed-bottom chat"; // "chat-tab"
    const chatClassName = "chat-tab";
    return (
      <div className="padding">
        {contacts}
        <a href="/Chat" id="activity" style="text-decoration: none;">
          <div className={chatClassName} role="navigation">
            {chat}
          </div>
        </a>
      </div>
    );
  }
}
