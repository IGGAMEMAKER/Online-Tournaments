/**
 * Created by gaginho on 22.05.16.
 */
import { h, Component } from 'preact';
import PackButtons from './PackButtons';

type PropsType = {
  pack: {
    src: string,
    color: string,
    frees: Array,
    price: number,
    buttons: Array,
  },

  onClickFree: Function,
  onClick: Function,
};

export default function (props:PropsType): Component {
  let style = {};
  if (props.pack.color > -1) {
    style['background-image'] = `url('/img/cardLayers/${props.pack.color}.jpg')`;
  }

  return (
    <div>
      <img border="0" alt="" className="card img-wrapper" style={style} src="/img/topics/realmadrid/pack.png" />
      <PackButtons onClick={props.onClick} onClickFree={props.onClickFree} pack={props.pack} />
    </div>
  );
}
