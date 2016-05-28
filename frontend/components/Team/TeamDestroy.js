/**
 * Created by gaginho on 28.05.16.
 */
import { h, Component } from 'preact';

type PropsType = {
  captain: string,
  deleteTeam: Function,
}

export default class TeamDestroy extends Component {
  state = {
    wannaDeleteTeam: false,
  };

  showDelButton = () => {
    this.setState({ wannaDeleteTeam: true });
  };

  cancelDelete = () => {
    this.setState({ wannaDeleteTeam: false });
  };

  render() {
    const props: PropsType = this.props;
    let deleteTeam;
    const deleteTeamButtons = (
      <div>
        <h2>Вы действительно хотите распустить команду?</h2>
        <button
          onClick={this.cancelDelete}
          className="btn btn-danger btn-bg btn-lg"
        >НЕТ</button>
        <button
          onClick={props.deleteTeam}
          className="btn btn-success"
        >да</button>
      </div>
    );

    if (login === props.captain) {
      deleteTeam = (
        <div>
          <button
            className="btn btn-danger"
            onClick={this.showDelButton}
          >Удалить команду</button>
          {this.state.wannaDeleteTeam ? deleteTeamButtons : ''}
        </div>
      );
    }

    return deleteTeam;
    // return (
    //   <div>
    //     <div className="white text-center">
    //       {deleteTeam}
    //     </div>
    //   </div>
    // );
  }
}
