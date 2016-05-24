/**
 * Created by gaginho on 22.05.16.
 */
import { h, Component } from 'preact';

type PropsType = {
  pack: {
    frees: Array<number>,
    price: number,
    buttons: Array<number>,
  },
  onClickFree: Function,
  onClick: Function,
}

export default function (props: PropsType): Component {
  // console.log('PackButtons.js', props);
  const buttons = props.pack.frees.map((value, i) => {
    let text = '';
    let className = '';
    let onClick;

    if (value > 0) {
      text = <span> Открыть <br /> бесплатно ({value}X) </span>;
      className = 'btn btn-success full';
      onClick = props.onClickFree;
    } else {
      text = `Открыть за ${props.pack.buttons[i]} РУБ`;
      className = 'btn btn-primary full btn-lg';
      onClick = props.onClick;
    }

    return (
      <div>
        <button className={className} onClick={onClick}>{text}</button>
        <br />
        <br />
      </div>
    );
  });

  return <div>{buttons}</div>;
}
