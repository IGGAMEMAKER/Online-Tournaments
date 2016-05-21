/**
 * Created by gaginho on 20.05.16.
 */
import { h, Component } from 'preact';
import request from 'superagent';

type Player = {
  name: string,
}

type PropsType = {
  money: number,
  players: Array<Player>,
}

export default function (props:PropsType):Component {
  const count = props.players.length;
  const money = props.money + 100;

  if (money <= 0) {
    return '';
  }
  const willReceive = Math.floor(money / count);
  const modulo = money % count;
  let balanceNext = '';
  if (modulo) {
    balanceNext = <p>на счету останется {modulo} РУБ</p>;
  }

  const divide = () => {
    request.post('/api/teams/divide');
    //box-shadow: 0 0 50px #ffc800;
  };

  return (
    <div className="white text-center">
      <p>Вы можете поделить деньги поровну</p>
      <p>каждый член команды получит {willReceive} РУБ</p>
      {balanceNext}
      <button onClick={divide} className="btn btn-success btn-lg">Поделить деньги</button>
    </div>
  );
}
