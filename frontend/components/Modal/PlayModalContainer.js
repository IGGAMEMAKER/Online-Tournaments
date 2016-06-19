import { h, Component } from 'preact';
import Modal from './Modal';
import ModalTest from './ModalTest';
// import store from '../../stores/ProfileStore';
// import actions from '../../actions/ProfileActions';

type PropsType = {
  tournaments: Array,
}

type StateType = {
  // tournaments: Array,
  visible: Boolean,
}

type TournamentStartType = {
  tournamentID: number,
  gameUrl: string,
  gameName: number,
}

// type ResponseType = {}

export default class PlayModalContainer extends Component {
  state = {
    visible: true,
  };

  componentWillMount() {}

  render(props: PropsType, state: StateType) {
    const tournaments: Array = props.tournaments;
    console.warn('render runningTournaments', tournaments);
    // return <ModalTest />;

    if (!tournaments.length) return <div></div>;
    // if (!tournaments.length) return <div></div>;

    const header = 'Турниры начинаются!';
    // const body = 'BODY';

    const body = tournaments.map((t: TournamentStartType) => {
      const id = t.tournamentID;
      // const gameUrl = store.getGameUrl(id);
      const gameUrl = t.gameUrl;
      // id="form1"
      return (
        <form method="post" action={gameUrl}>
          <input type="hidden" name="login" value={login} />
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
    // return <ModalTest />;
    // if (!state.visible)
    return <Modal data={{ header, body, footer, count: 0 }} hide={!state.visible} />;
  }
}
