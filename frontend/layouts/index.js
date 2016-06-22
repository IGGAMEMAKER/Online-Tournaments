import { h, Component } from 'preact';
import Menu from '../components/Shared/Menu';
import socketListener from '../helpers/SocketListener';

type PropsType = {
  content: ?any,
}

type StateType = {}

export default class Layout extends Component {
  componentWillMount() {}

  render(props: PropsType, state: StateType) {
    return (
      <div>
        <center>
          <Menu />
          <div>{props.content}</div>
        </center>
      </div>
    );
  }
}
