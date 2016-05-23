/**
 * Created by gaginho on 23.05.16.
 */
import { h, Component } from 'preact';

type PropsType = {
  requests: Array<string>,
  captain: string,
  onClick: Function,
};

export default function (props: PropsType): Component {
  const requests = props.requests.map((r: string) => {
    let acceptPlayer = props.captain;
    const style = 'margin-left:20px;';
    if (login === props.captain) {
      acceptPlayer = (
        <button onClick={props.onClick(r)} className="btn btn-success" style={style}>
          Принять в команду
        </button>
      );
    }
    return (
      <p>
        {r}
        <span>{acceptPlayer}</span>
      </p>
    );
  });
  return (
    <div>
      <h1 className="white text-center"> Заявки на вступление в команду </h1>
      {requests}
    </div>
  );
}