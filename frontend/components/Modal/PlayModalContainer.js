import { h, Component } from 'preact';
import Modal from './Modal';
import store from '../../stores/ProfileStore';
import actions from '../../actions/ProfileActions';

type PropsType = {
  tournaments: Array,
}

type StateType = {
  tournaments: Array,
}

type TournamentStartType = {
  tournamentID: number,
  gameName: number,
}

type ResponseType = {}

export default class PlayModalContainer extends Component {
  state = {
    tournaments: [],
    visible: false,
  };

  componentWillMount() {
    // store.addChangeListener(() => {
    //   this.setState({
    //     runningTournaments: store.getRunningTournaments,
    //     visible: true,
    //   });
    // });
    // actions.initialize();
  }

  drawPlayButton = (host, port, tournamentID) => {
    var addr = `http://${host}:${port}/Game?tournamentID=${tournamentID}`;
    return (
      <form id="form1" method="post" action={addr}>
        <input type="hidden" name="login" value="'+login+'" />
        <input
          type="submit"
          className="btn btn-primary btn-lg"
          value={`Сыграть в турнир #${tournamentID}`}
        />
      </form>
    );
  };

  drawPlayButtons = (tournaments: Array<TournamentStartType>) => {
    return tournaments.map((t) => {
      const host = 'localhost';
      const port = '5010';

      return this.drawPlayButton(host, port, t.tournamentID);
    });
  };

  render(props: PropsType, state: StateType) {
    const tournaments: Array = props.tournaments;

    if (!tournaments.length || !state.visible) return '';

    console.log('render runningTournaments', tournaments);
    const header = 'Турниры начинаются!';

    // const body = this.drawPlayButtons(tournaments);
    const body = tournaments.map((t: TournamentStartType) => {
      const id = t.tournamentID;
      const gameUrl = store.getGameUrl(id);

      return (
        <form id="form1" method="post" action={gameUrl}>
          <input type="hidden" name="login" value="'+login+'" />
          <input
            type="submit"
            className="btn btn-primary btn-lg"
            value={`Сыграть в турнир #${id}`}
          />
        </form>
      );
    });

    const footer = (
      <button
        className="btn btn-default"
        onClick={() => { this.setState({ visible: false }); }}
      >Закрыть</button>
    );
    return <Modal data={{ header, body, footer }} />;
  }
}
