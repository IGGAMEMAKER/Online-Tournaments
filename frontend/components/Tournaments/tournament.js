/**
 * Created by gaginho on 04.06.16.
 */
import { h, Component } from 'preact';

type TournamentType = {
  tournamentID: number,
  status: number,
  starTime: Date,
  players: number,
  goNext: Array<number>,
  gameNameID: number,
  prizes: Array<number>,

  settings: Object,
}

type PropsType = {
  authenticated: boolean,
  registeredInTournament: boolean,

  data: TournamentType,

  register: Function,
  unregister: Function,

}

export default class Tournament extends Component {
  // unregister = (props: PropsType) => {
  //   return () => {
  //     props.unregister(props.data.tournamentID);
  //   };
  // };

  render(props: PropsType) {
    const id = props.data.tournamentID;

    const prizes = props.data.prizes || [100];
    const prizeList = prizes.map((p: number) => <p>{p}</p>);

    const cover = (
      <div className="cover">
        <img src="/img/topics/realmadrid.jpg" alt="" />
      </div>
    );

    let actionButtons = '';
    if (props.authenticated) {
      if (props.registeredInTournament) {
        actionButtons = (
          <a className="btn toggle-tickets wrap-text" style="display: none;">
            Вы участвуете в турнире
            <br />
            Дождитесь начала
          </a>
        );
      } else {
        actionButtons = (
          <a className="btn toggle-tickets wrap-text" onClick={() => props.unregister(id)}>
            Участвовать
          </a>
        );
      }
    } else {
      actionButtons = (
        <a className="btn toggle-tickets wrap-text" href="Login">Авторизоваться</a>
      );
    }

    return (
      <div>
        <div className="ticket-card" id={`bgd${id}`}>
          {cover}
          <div className="body">
            <div className="info">
              <div className="going" id={`plrs-${id}`}>
                <i className="fa fa-group fa-lg" />
                Игроки : {props.data.players}/{props.data.goNext[0]}
              </div>
              <div className="tickets-left">№{id}</div>
            </div>
            <br />
            <div className="price text-center">
              <div className="from">Призы</div>
              <div className="value">{prizeList}</div>
            </div>
            <div className="clearfix"></div>
            <div className="clearfix"></div>
          </div>
          <div className="collapse"></div>
          <div className="footer" id={`footer${id}`}>{actionButtons}</div>
        </div>
      </div>
    );
  }
}
