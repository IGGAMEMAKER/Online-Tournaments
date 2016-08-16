import { h, Component } from 'preact';

type PropsType = {
  onClick: Function,
  type: string,
  size: string,
  text: Component
}

export default class Button extends Component {
  render(props: PropsType) {
    let className = 'btn btn-primary btn-lg';
    // if (props.type) {}
    return (
      <div
        onClick={props.onClick}
        className={className}
      >
        {props.text}
      </div>
    );
  }
}
