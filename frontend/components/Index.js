import { h, Component } from 'preact';
import store from '../stores/ProfileStore';
import actions from '../actions/ProfileActions';

import VKWidget from './Widgets/VKWidget';

import PointTournament from './Tournaments/PointTournament';
import RoundTournament from './Tournaments/RoundTournament';

import stats from '../helpers/stats';

import DemoTournamentsContainer from './Tournaments/DemoTournamentsContainer';

import clipboard from '../helpers/copy-to-clipboard';

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

  render(props: PropsType, state: StateType) {
    // <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12"></div>
    //     <div className="center height-fix offset hide">
    //       {this.renderSharingCard(state)}
    //     </div>
    return (
      <div>
        <div className="center height-fix offset">
          {this.renderRealMadridAdvert()}
        </div>
        <div>
          {this.renderDemoTournaments()}
        </div>
      </div>
    );
  }

  CopyShareLink = () => {
    clipboard('invite-link');

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

  renderRealMadridAdvert = () => {
    return (
      <div>
        <h2 className="content-title">Выиграй футболку Реал Мадрид 2016/2017!</h2>
        <div className="round-tournament-cover" style={`background-image: url('/img/rounds/Benzema.jpg'); position: relative`}>
          <div style="position: absolute; top: 60%; left: 0; right: 0">
            <a className="link" href="/realmadrid">Подробнее</a>
          </div>
        </div>
      </div>
    );
  };

  renderDemoTournaments = () => {
    return (
      <div>
        <h2 className="content-title"> Проверь свои знания</h2>
        <DemoTournamentsContainer />
      </div>
    );
  };

  renderSharingCard = (state: StateType) => {
    let link = 'http://online-tournaments.org/register';

    if (login) {
      link += `?inviter=${login}`;
    }

    return (
      <div className="col-lg-12 killPaddings">
        <div className="freeroll ctr purple share-container">
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
                <p style={{display: state.copied ? 'block' : 'none'}}>Ссылка скопирована</p>
              </center>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderPointTournament = (state: StateType) => {
    return state.tournaments ? state.tournaments
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
  };

  renderRealMadridTournaments = (state: StateType) => {
    return state.tournaments ?
      state.tournaments
        .filter(t => t.settings && t.settings.tag === 'realmadrid')
        .map(t => <RoundTournament data={{tournamentID: t.tournamentID}} />)
      :
      '';
  };
}
