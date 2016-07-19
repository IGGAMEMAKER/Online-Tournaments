import { h, Component } from 'preact';
import Card from './Card';
import BigCard from './BigCard';

type PropsType = {
  title: string,
  info: string,
  color: string,
  button: Component,
  full: boolean,

  type: string
}

type StateType = {}

export default class AdvancedCard extends Component {
  state = {};

  componentWillMount() {}

  render(props: PropsType, state: StateType) {
    let { title, info, color, button, full } = props;
    let cardType = props.type;

    if (!color) {
      color = 'green';
    }

    if (!info) {
      info = [];
    }

    const content = (
      <div className={`freeroll ctr ${color}`}>
        <div className="white">
          <h1 className="fadeText">{title}</h1>
          <p>
            {info.map(t => <div>{t}</div>)}
          </p>
          <center>
            {button}
          </center>
        </div>
      </div>
    );

    if (!cardType) {
      return <Card content={content} />
    }

    if (cardType === 'big') {
      return <BigCard content={content} />
    }
  }
}
