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
  render() {
    return (
      <div>
        <div className="center height-fix offset">
          {this.renderRealMadridAdvert()}
        </div>
        <div className="center height-fix offset">
          {this.renderDemoTournaments()}
        </div>
      </div>
    );
  }

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
  }

  renderRealMadridAdvert = () => {
    return (
      <div>
        <h2 className="content-title">Выиграй футболку Реал Мадрид 2016/2017!</h2>
        <div className="round-tournament-cover relative" style={`background-image: url('/img/rounds/Benzema.jpg');`}>
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

    const copyShareLink = () => {
      clipboard('invite-link');

      this.setState({ copied: true });
      stats.shareLinkCopied();
    };

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
                  onClick={copyShareLink}
                  style="min-width: 200px; max-width: 350px; width: 100%"
                >{link}</input>
                <a
                  className="btn btn-primary btn-large btn-lg offset-md"
                  onClick={copyShareLink}
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
