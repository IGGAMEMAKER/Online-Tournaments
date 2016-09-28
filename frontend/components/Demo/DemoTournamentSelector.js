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
        <div className="white">
          <h1>Другие турниры</h1>
        </div>
        <br />
        <button
          className="btn btn-primary"
          onClick={props.next}
        >Дальше</button>
      </div>
    );
  }
}
