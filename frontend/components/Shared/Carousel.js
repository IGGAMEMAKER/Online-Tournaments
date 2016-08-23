import { h, Component } from 'preact';

type PropsType = {
  list: Array<Component>,
  speed: number
}

type StateType = {
  index: number
}

export default class Carousel extends Component {
  state = {
    index: 0,
    animate: 'animate'
  };

  componentDidMount() {
    setInterval(() => {
      const length = this.props.list.length;
      const index = this.state.index;

      this.setState({
        index: length === index + 1 ? 0 : index + 1,
        animate: ''
      });

      setTimeout(() => {
        this.setState({ animate: 'animate' });
      }, 100);
    }, this.props.speed || 4000)
  }

  render(props: PropsType, state: StateType) {
    return (
      <div className="">
        {
          props.list.length ?
            <div className={`my-carousel-item ${state.animate}`}>
              {props.list[state.index]}
            </div>
            :
            'no components'
        }
      </div>
    );
  }
}
