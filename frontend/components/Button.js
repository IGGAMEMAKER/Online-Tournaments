/**
 * Created by gaginho on 22.05.16.
 */
import { h, Component } from 'preact';

type PropsType = {
  type: string,
  text: string,
  onClick: Function,
  style: Object
}

export default function (props: PropsType): Component {
  let className = 'btn';
  const style = props.style || {};

  switch (props.type) {
    case 'primary':
      className += ' primary';
      break;
    default:
      break;
  }
  return (
    <button style={style} className={className} value={props.text} onClick={props.onClick} />
  );
}
