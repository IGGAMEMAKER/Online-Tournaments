import { h, Component } from 'preact';

type PropsType = {
  next: Function
}

type StateType = {}

export default class DemoTest extends Component {
  state = {};

  componentWillMount() {}

  render(props: PropsType, state: StateType) {
    return (
      <div>
        DemoResult
        <br />
        <button
          className="btn btn-primary"
          onClick={props.next}
        >Дальше</button>
      </div>
    );
  }
}
