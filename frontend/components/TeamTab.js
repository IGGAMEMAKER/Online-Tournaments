/**
 * Created by gaginho on 18.05.16.
 */
import { h, Component } from 'preact';

// import request from 'superagent';

type PropsType = {
  joined: Boolean,
  team: Object
};

export default function f(props: PropsType): Component {
  console.log('Team Tab');
  if (props.joined) {
    return (
      <div> Вы состоите в команде {props.team.name} </div>
    );
  }
  // const a = <div> </div>;
  const button = 'btn btn-primary btn-lg offset-lg';
  return (
    <div>
      <h1 className="white text-center">Создай команду мечты и пригласи своих друзей!</h1>
      <center>
        <form action="/Team" method="post">
          <h2 className="white">Название новой команды </h2>
          <input type="text" className="circle-input " autofocus />
          <br />
          <input type="submit" value="Создать команду" className={button} />
        </form>
      </center>
    </div>
  );
}
