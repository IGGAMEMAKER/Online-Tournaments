/**
 * Created by gaginho on 20.05.16.
 */
import { h, Component } from 'preact';
import TeamDivideMoney from './TeamDivideMoney';
import TeamRequests from './TeamRequests';

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
  accept : Function
};

export default function drawTeam(props: PropsType): Component {
  console.log('drawTeam', 'TeamDraw', props);
  // const requests = ['AlexKing', 'golozhopik'];
  const requests = props.team.requests || [];

  const team = props.team;
  const players = team.players.map((player) => (<p>{player.name}</p>));
  return (
    <div>
      <div className="white text-center">
        <h1>Команда {team.name}</h1>
        <h3>На счету {team.money} РУБ</h3>
        <TeamDivideMoney money={team.money} players={team.players} />
        <h2>Капитан команды</h2>
        <h3>{team.captain}</h3>
        <h2>Состав команды</h2>
        <h3>{players}</h3>
        <TeamRequests onClick={props.accept} captain={team.captain} requests={requests} />
      </div>
    </div>
  );
}
