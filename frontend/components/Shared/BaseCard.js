import { h, Component } from 'preact';

type PropsType = {
  color: string,
  image: string,

  style: string,
  content: Component,
  className: string,
}

type StateType = {}

export default class Card extends Component {
  state = {};

  componentWillMount() {}

  render(props: PropsType, state: StateType) {
    let basicCardClass = '';
    const { className, style } = props;

    if (!className && !style) {
      basicCardClass = 'card';
    }

    return (
      <div className={`${className} ${basicCardClass}`} style={style}>{props.content}</div>
    );
  }
}
