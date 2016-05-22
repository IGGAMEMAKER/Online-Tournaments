/**
 * Created by gaginho on 22.05.16.
 */
import { h, Component } from 'preact';

type PropsType = {
  frees: number,
  price: number,
  onClickFree: Function,
  onClick: Function,
}

export default function (props: PropsType): Component {
  let frees = '';
  if (props.frees) {
    frees = (
      <div>
        <button className="btn btn-success full" onClick={props.onClickFree}>
          Открыть
          <br />
          бесплатно ({props.frees}X)
        </button>
        <br />
        <br />
      </div>
    );
  }

  return (
    <div>
      {frees}
      <button className="btn btn-primary full" onClick={props.onClick}> Открыть за ({props.price} РУБ) </button>
    </div>
  );
}