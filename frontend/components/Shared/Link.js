import { h, Component } from 'preact';
import { route } from 'preact-router';

type PropsType = {
  onClick: Function,
  href: string,

  className: string,
  style: string,

  content: ?Component
}

export default class LinkCustom extends Component {

  render(props: PropsType) {
    return (
      <a
        href={props.href || '/'}
        onClick={() => {
          if (props.onClick) {
            props.onClick();
          }
          setTimeout(() => {
            window.scrollTo(0, 0);
          }, 50);
        }}
        className={props.className}
        style={props.style}
      >
        {props.content}
      </a>
    );
  }
}
