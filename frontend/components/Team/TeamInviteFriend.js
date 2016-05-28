/**
 * Created by gaginho on 28.05.16.
 */
import { h, Component } from 'preact';

type PropsType = {
  findUser: Function,
  inviteFriend: Function
}

export default function (props: PropsType):Component {
  const inviteFriend = () => {
    const player = document.getElementById('invite-friend').value;
    props.inviteFriend(player);
  };

  return (
    <div>
      <h1>Пригласи друга в команду</h1>
      <input
        placeholder="Логин друга"
        className="black circle-input"
        id="invite-friend"
        onChange={props.findUser}
      />
      <button
        onClick={inviteFriend}
        className="btn btn-success btn-mid"
      >Пригласить</button>
    </div>
  );
}
