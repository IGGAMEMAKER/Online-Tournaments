import { h, Component } from 'preact';

type PropsType = {
  next: Function
}

type StateType = {}

export default class DemoTest extends Component {
  render(props: PropsType, state: StateType) {
    // <button
    //   className="btn btn-primary"
    //   onClick={props.next}
    // >Дальше</button>
    return (
      <div>
        <div className="white">
          <h1>Вам также может быть интересно</h1>
        </div>
        <br />
        <div>
          <a href="/" className="link">Вернуться в главное меню</a>
        </div>

        <div>Вам также может быть интересно</div>
        <div>Турнир1</div>
        <div>Турнир2</div>
        <div>Турнир3</div>
      </div>
    );
  }
}
