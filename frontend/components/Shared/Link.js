import { h, Component } from 'preact';
import { route } from 'preact-router';

type PropsType = {
  onClick: Function,
  href: string,

  className: string,
  style: string,

  text: ?Component
}

export default class Link extends Component {
  render(props: PropsType) {
    return (
      <a
        href={props.href || '/'}
        onClick={() => {
          if (props.onClick) {
            props.onClick();
          }

          // setTimeout(() => {
          //   route(href);
          // }, 0);
        }}
        className={props.className}
        style={props.style}
      >
        {props.text}
      </a>
    );
  }
}
