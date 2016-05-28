/**
 * Created by gaginho on 20.05.16.
 */
import { h, Component } from 'preact';
import TeamDivideMoney from './TeamDivideMoney';
// import TeamRequests from './TeamRequests';
import TeamInviteFriend from './TeamInviteFriend';
import TeamDestroy from './TeamDestroy';

import request from 'superagent';

type Player = {
  name: string
};

type PropsType = {
  team: {
    name: string,
    captain: string,
    players: Array<Player>,
    money: number,
    settings: Object,
    requests: Array
  },
  accept: Function,
  update: Function,

  findUser: Function,
  inviteFriend: Function,

  deleteTeam: Function,
};

export default class drawTeam extends Component {
  kickPlayer = (user, teamname) => {
    const props: PropsType = this.props;
    return () => {
      request
        .post(`/api/teams/kick/${user}/${teamname}`)
        .end(() => {
          props.update();
        });
    };
  };

  kickButton = (user, teamname) => {
    return (
      <span
        className="btn btn-danger"
        onClick={this.kickPlayer(user, teamname).bind(this)}
        style="margin-left:20px;"
      >Выгнать</span>
    );
  };

  render() {
    const props: PropsType = this.props;
    console.log('drawTeam', 'TeamDraw', props);

    const team = props.team;
    const captain = team.captain;

    const players = team.players.map((player) => {
      const user = player.name;
      let kick = '';

      if (login === captain && user !== captain) {
        kick = this.kickButton(user, team.name);
      }

      let captainImg = '';
      if (user === captain) {
        captainImg = <span> КАПИТАН </span>;
      }

      return <p>{user} {captainImg} {kick}</p>;
    });

    let deleteTeam;

    let invitationTab = '';
    if (login === captain) {
      if (props.team.players.length < 5) {
        invitationTab = <TeamInviteFriend findUser={props.findUser} inviteFriend={props.inviteFriend} />;
      }

      deleteTeam = (
        <TeamDestroy
          captain={captain}
          deleteTeam={props.deleteTeam}
        />
      );
    }

    return (
      <div>
        <div className="white text-center">
          <h1>{team.name}</h1>
          <p>На счету {team.money} РУБ</p>
          <TeamDivideMoney money={team.money} players={team.players} />
          <br />
          <h2>Состав команды</h2>
          <p>{players}</p>
          <br />
          {invitationTab}
          <br />
          <br />
          {deleteTeam}
        </div>
      </div>
    );
  }
}
