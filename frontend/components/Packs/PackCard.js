/**
 * Created by gaginho on 22.05.16.
 */
import { h, Component } from 'preact';
import request from 'superagent';

type PropsType = {
  name: string,
  description: string,
  type: number,
  src: string,
  color: string,
};

export default function (props:PropsType):Component {
  let style = {};
  if (props.color) {
    style['background-image'] = `url('/img/cardLayers/${props.color}.jpg')`;
  }

  return (
    <div>
      <p className="card-name white">{props.name}</p>
      <img border="0" alt="" className="card img-wrapper" style={style} src={props.src} />
      <p className="card-name white">{props.description}</p>
    </div>
  );
}
