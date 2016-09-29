import { h, Component } from 'preact';

type PropsType = {
  next: Function
}

type StateType = {}

export default class DemoTest extends Component {
  state = {};

  componentWillMount() {}

  render(props: PropsType, state: StateType) {
    // <button
    //   className="btn btn-primary"
    //   onClick={props.next}
    // >Дальше</button>
    return (
      <div>
        DemoResult
        <div className="white">
          <h1>Другие турниры</h1>
        </div>
        <br />
        <div>
          <a href="/" className="link">Другие турниры</a>
        </div>

        <div>Вам также может быть интересно</div>
        <div>Турнир1</div>
        <div>Турнир2</div>
        <div>Турнир3</div>
      </div>
    );
  }
}
