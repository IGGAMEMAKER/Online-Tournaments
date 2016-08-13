import { h, Component } from 'preact';
import store from '../stores/ProfileStore';
import actions from '../actions/ProfileActions';
import Card from '../components/Shared/Card';

import PointTournament from './Tournaments/PointTournament';

import stats from '../helpers/stats';

import constants from '../constants/constants';

type PropsType = {}

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

    actions.initialize();
  }

  CopyShareLink = () => {
    const id = 'invite-link';
    const node = document.getElementById(id);
    node.select();
    document.execCommand('copy');
    node.blur();
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
    const dailyFreeroll = (
      <div className="freeroll ctr green">
        <div className="white">
          <h1 className="fadeText"> Выиграй 50 рублей в бесплатной викторине!</h1>
          <p>
            <div>Время начала - 20:00 (каждый день)</div>
            <div>Присоединяйся!</div>
          </p>
          <center>
            <a
              className="btn btn-primary btn-large btn-lg btn-fixed"
              href="/Tournaments#daily"
            >Участвовать</a>
          </center>
        </div>
      </div>
    );

    // const freerolls = (
    //   <div className="freeroll ctr green">
    //     <div className="white">
    //       <h1 className="fadeText">Турниры для новичков</h1>
    //       <p>
    //         <div>Каждый день в 20:00</div>
    //       </p>
    //       <center>
    //         <a
    //           className="btn btn-primary btn-large btn-lg btn-fixed"
    //           href="/Tournaments#daily"
    //         >Подробнее</a>
    //       </center>
    //     </div>
    //   </div>
    // );

    const freerolls = this.category(
      'Бесплатные турниры',
      ['Проходят каждый день'],
      'green',
      this.categoryButton(
        `/Frees`,
        stats.goToFrees
      )
    );

    const eliteTournaments = this.category(
      'Элитные турниры',
      ['Большие призы', 'Низкая конкуренция'],
      'red',
      this.categoryButton(
        `/Elite`,
        stats.goToElite
      )
    );

    const middleTournaments = this.category(
      'Большие турниры',
      ['Самые крупные призы', 'Низкая стоимость участия'],
      'carrot',
      this.categoryButton(
        `/Crowd`,
        stats.goToCrowd
      )
    );

    // const eliteTournaments = (
    //   <div className="freeroll ctr red">
    //     <div className="white">
    //       <h1 className="fadeText">Элитные турниры</h1>
    //       <p>Самые крупные призы</p>
    //       <center>
    //         <a
    //           className="btn btn-primary btn-large btn-lg btn-fixed"
    //           href="/Tournaments#top"
    //         >Участвовать </a>
    //       </center>
    //     </div>
    //   </div>
    // );
    const weeklyFreeroll = (
      <div className="freeroll ctr red">
        <div className="white">
          <h1 className="fadeText">Сорви куш в ТОП турнирах!</h1>
          <p>
            <div>Участвуй в турнирах с большими призами</div>
            <div>Выиграй вплоть до 5000 рублей</div>
            <div>Стоимость участия в главном турнире - 50 рублей</div>
          </p>
          <center>
            <a
              className="btn btn-primary btn-large btn-lg btn-fixed"
              href="/Tournaments#top"
            >Участвовать </a>
          </center>
        </div>
      </div>
    );

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
              <div>Отправь ссылку друзьям и участвуй с ними в турнирах</div>
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

    const pointTournaments = state.tournaments? state.tournaments
      .filter(
        (t => t.settings && t.settings.tag === 'point' && t.settings.points)
      )
      .map(t => <PointTournament points={t.settings.points} time={20} />)
      :
      '';
    return (
      <div>
        <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12"></div>
        <div className="center height-fix offset">
          <h2 className="white">Ежедневно</h2>
          {pointTournaments}
          <PointTournament points={100} time={20} />
          <PointTournament points={500} />
          <PointTournament points={1000} />
          <PointTournament points={2000} />
        </div>
        <div className="center height-fix offset">
          <div className="col-lg-12 killPaddings">{shareCard}</div>
        </div>
      </div>
    );
  }
}
