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
  render(props: PropsType) {
    const id = props.data.tournamentID;

    const prizes = props.data.Prizes || [100];
    const prizeList = prizes.map((p: number) => <p>{p} РУБ</p>);

    const cover = (
      <div className="cover">
        <img src="/img/topics/realmadrid.jpg" alt="" />
      </div>
    );

    let actionButtons = '';
    console.log('props', props);

    if (props.authenticated) {
      if (props.registeredInTournament) {
        actionButtons = (
          <a className="btn toggle-tickets wrap-text">
            Вы участвуете в турнире
            <br />
            Дождитесь начала
          </a>
        );
      } else {
        actionButtons = (
          <a className="btn toggle-tickets wrap-text" onClick={() => props.register(id)}>
            Участвовать
          </a>
        );
      }
    }
    // style="width: 300px; display: inline-block;"
    // box-shadow: 0 0 5px 2px rgba(0,0,0,.35);
    const participating = props.registeredInTournament ? 'participating' : '';
    return (
      <div className="col-sm-6 col-md-4">
        <div
          className={`ticket-card ${participating}`}
          id={`bgd${id}`}
          style="box-shadow: -5px -5px 9px 5px rgba(0,0,0,0.4);"
        >
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
