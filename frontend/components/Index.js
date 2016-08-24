import { h, Component } from 'preact';
import store from '../stores/ProfileStore';
import actions from '../actions/ProfileActions';
import Card from '../components/Shared/Card';

import Carousel from '../components/Shared/Carousel';

import VKWidget from './Widgets/VKWidget';


import RMAPage from '../components/Tournaments/Specials/Realmadrid';

import PointTournament from './Tournaments/PointTournament';
import RoundTournament from './Tournaments/RoundTournament';

import stats from '../helpers/stats';

type StateType = {}

export default class Index extends Component {
  state = {
    copied: false
  };

  componentWillMount() {
    store.addChangeListener(() => {
      this.setState({
        registeredIn: store.getMyTournaments(),
        money: store.getMoney(),
        value: store.getTestValue(),
        tournaments: store.getAvailableTournaments()
      });
    });

    // actions.initialize();
  }

  CopyLink = (id) => {
    const node = document.getElementById(id);
    node.select();
    document.execCommand('copy');
    node.blur();
  };

  CopyShareLink = () => {
    const id = 'invite-link';
    this.CopyLink(id);

    this.setState({ copied: true });
    stats.shareLinkCopied();
  };

  categoryButton = (url, onClick, text) => {
    return (
      <a
        className="btn btn-primary btn-large btn-lg btn-fixed"
        href={url}
        onClick={onClick}
      >{text ? text : 'Перейти'}</a>
    );
  };

  category = (title, info, color = 'green', button) => {
    return (
      <div className={`freeroll ctr ${color}`}>
        <div className="white">
          <h1 className="fadeText">{title}</h1>
          <p>
            {info.map(t => <div>{t}</div>)}
          </p>
          <center>{button}</center>
        </div>
      </div>
    );
  };

  render(props: PropsType, state: StateType) {
    /*
     <hr width="40%" />
     <p>Если вы (или ваш друг) выиграете в ежедневном бесплатном турнире,</p>
     <p>то вся команда получит вплоть до 150 рублей</p>
     <p>(в зависимости от размера команды)</p>
     */
    let link = 'http://online-tournaments.org/register';

    if (login) {
      link += `?inviter=${login}`;
    }

    // <a className="btn btn-primary btn-large btn-lg" href="/Team">Создать команду</a>
    // http://online-tournaments.org/register
    // style={{
    //   display: login ? 'block' : 'none'
    // }}

    // const shareCard = (
    //   <div>
    //     <div className="freeroll ctr purple glass">
    //       <div className="white">
    //         <h1 className="fadeText">Побеждай с друзьями</h1>
    //         <p className="center">
    //           <div>Отправь ссылку друзьям и участвуй с ними в турнирах</div>
    //           <div>Если они займут призовое место в бесплатном турнире</div>
    //           <div>ты получишь дополнительные 50% от их выигрыша!</div>
    //         </p>
    //         <div>
    //           <center>
    //             <input
    //               id="invite-link"
    //               type="text"
    //               className="black circle-input offset-md"
    //               value={link}
    //               onClick={this.CopyShareLink}
    //               style="min-width: 200px; max-width: 350px; width: 100%"
    //             >{link}</input>
    //             <a
    //               className="btn btn-primary btn-large btn-lg offset-md"
    //               onClick={this.CopyShareLink}
    //             >Скопировать</a>
    //             <p
    //               style={{
    //                 display: state.copied ? 'block' : 'none'
    //               }}
    //             >Ссылка скопирована</p>
    //           </center>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // );
    const shareCard = (
      <div>
        <div className="freeroll ctr purple glass">
          <div className="white">
            <h1 className="fadeText">Побеждай с друзьями</h1>
            <p className="center">
              <div>Отправь ссылку друзьям и участвуй с ними в турнирах!</div>
            </p>
            <div>
              <center>
                <input
                  id="invite-link"
                  type="text"
                  className="black circle-input offset-md"
                  value={link}
                  onClick={this.CopyShareLink}
                  style="min-width: 200px; max-width: 350px; width: 100%"
                >{link}</input>
                <a
                  className="btn btn-primary btn-large btn-lg offset-md"
                  onClick={this.CopyShareLink}
                >Скопировать</a>
                <p
                  style={{
                    display: state.copied ? 'block' : 'none'
                  }}
                >Ссылка скопирована</p>
              </center>
            </div>
          </div>
        </div>
      </div>
    );

    // <div id="WeeklyFreeroll" className="row" style="height: inherit;">{weeklyFreeroll}</div>
    // <div id="Freeroll" className="row" style="height: inherit;">{dailyFreeroll}</div>

    // <div className="row">{teamTab}</div>

    // <div className="big-cards-container">
    //   <ul style="display: table-row;">
    //     <li style="display: table-cell; width: 320px; float: left">
    //       <div className="card-container-semi">
    //       </div>
    //     </li>
    //     <li style="display: table-cell; width: 320px; float: right;">
    //       <div className="card-container-semi">
    //       </div>
    //     </li>
    //   </ul>
    // </div>

    // <Card content={freerolls} style="" />
    // <Card content={middleTournaments} style="" />
    //   <Card content={eliteTournaments} style="" />

    const pointTournaments = state.tournaments ? state.tournaments
      .filter(t => t.settings && t.settings.tag === 'point' && t.settings.points)
      .map(t =>
        <PointTournament
          points={t.settings.points}
          cover={t.settings.cover}
          time={20}
          isRegistered={store.isRegisteredIn(t.tournamentID)}
          onRegister={() => { actions.register(t.tournamentID) }}
          players={t.players}
        />
      )
      :
      '';

    // <PointTournament
    //   points={t.settings.points}
    //   cover={t.settings.cover}
    //   time={20}
    //   isRegistered={store.isRegisteredIn(t.tournamentID)}
    //   onRegister={() => { actions.registerOnSubscribeTournament(t.tournamentID) }}
    //   players={t.players}
    // />

    // const roundTournaments = state.tournaments? state.tournaments
    //   .filter(t => t.settings && t.settings.tag === 'subs')
    //   .map(t =>
    //     <RoundTournament
    //       data={{
    //         tournamentID: t.tournamentID
    //       }}
    //     />
    //   )
    //   :
    //   '';

    const realmadridTournaments = state.tournaments? state.tournaments
      .filter(t => t.settings && t.settings.tag === 'realmadrid')
      .map(t =>
        <RoundTournament
          data={{
            tournamentID: t.tournamentID
          }}
        />
      )
      :
      '';
    // {roundTournaments}
    //           <VKWidget />
    // Турниры для наших <a href="https://vk.com/o_tournaments" target="_blank">подписчиков</a>

    // <div className="center height-fix offset">
    //   <h2 className="content-title">Ежедневно</h2>
    //   {pointTournaments}
    // </div>

    const round1 = (
      <div className="white">
        R1
      </div>
    );
    const round2 = (
      <div className="white">
        R2
      </div>
    );


    //                 {realmadridTournaments}

    // [realmadridTournaments[0], realmadridTournaments[0]]
    return (
      <div>
        <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12"></div>
        <RMAPage />
        <div className="center height-fix offset">
          <h2 className="content-title">Выиграй футболку Реал Мадрид 2016/2017!</h2>
          <div className="round-tournament-cover" style={`background-image: url('/img/rounds/Benzema.jpg'); position: relative`}>
            <div style="position: absolute; top: 60%; left: 0; right: 0">
              <a className="link" href="/realmadrid">Подробнее</a>
            </div>
          </div>
        </div>
        <div className="center height-fix offset">
          <div className="col-lg-12 killPaddings">{shareCard}</div>
        </div>
      </div>
    );
  }
}
