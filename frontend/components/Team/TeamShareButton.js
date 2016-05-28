/**
 * Created by gaginho on 20.05.16.
 */
import { h, Component } from 'preact';

type PropsType = {
  team: Object,
  onClick: Function,
  copipasted: Boolean
}

export default function (props:PropsType):Component {
  const MAX_PLAYERS = 5;

  const length = props.team.players.length;
  const placesLeft = MAX_PLAYERS - length;

  let copipasted = '';

  if (props.copipasted) {
    copipasted = 'Ссылка скопирована';
  }
  const link = `http://online-tournaments.org/register?inviter=${login}`;
  if (length < MAX_PLAYERS) {
    return (
      <div className="white text-center">
        <p>Осталось мест в команде: {placesLeft}</p>
        <p>Друзья не зарегистрированы на данном сайте? Отправьте им ссылку</p>
        <input
          id="team-link"
          type="text"
          value={link}
          style="width: 250px;"
          className="black circle-input "
        />
        <br />
        <br />
        <button
          onClick={props.onClick}
          className="btn btn-primary btn-lg"
        >Пригласить друзей</button>
        <p>{copipasted}</p>
      </div>
    );
  }
  return <p>Состав полностью укомплектован!</p>;
}
