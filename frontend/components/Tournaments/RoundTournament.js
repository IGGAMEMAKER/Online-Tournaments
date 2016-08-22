import { h, Component } from 'preact';
import actions from '../../actions/ProfileActions';
import Button from '../Shared/Button';
// import

type PropsType = {
  data: Object
  // data: TournamentType
};

type StateType = {}

export default class RoundTournament extends Component {
  state = {};

  componentWillMount() {}

  render(props: PropsType, state: StateType) {
    const cover = '/img/rounds/Benzema.jpg';
    return (
      <div>
        <div className="round-tournament-cover" style={`background-image: url(${cover}); position: relative`}>
          <div style="position: absolute; top: 60%; left: 0; right: 0">
            <Button
              onClick={() => { actions.register(props.data.tournamentID, 0)} }
              text="Принять участие"
            />
          </div>
        </div>

      </div>
    );
  }
}
