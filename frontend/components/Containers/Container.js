import { h, Component } from 'preact';

type PropsType = {
  image: string,
  colour: string,
  content: Component,

  centerize: boolean,
  minHeight: number,
  width: number,
  faded: boolean
}

export default class Container extends Component {
  state = {};

  componentWillMount() {}

  render(props: PropsType, state: StateType) {
    const sizeClass = 'full'; // props.mobile ?
    // opacity: ${props.faded ? 0.8: 1};
    return (
      <div
        style={`position: relative; min-height: ${props.minHeight}; width: ${props.width || '100%'}`}
        className="height-fix"
      >
        <div
          style={`position: absolute; opacity: ${props.faded ? 0.8: 1}; background-image: url(${props.image}); top: 0; bottom: 0; left: 0; right: 0;`}
          className="img-responsive"
        ></div>
        {
          props.centerize ?
            <div className="tournament-centerize">{props.content}</div>
            :
            props.content
        }
      </div>
    );
  }
}
