import { h, Component } from 'preact';

type PropsType = {
  content: ?any,
}

type StateType = {}

type ResponseType = {}

export default class Layout extends Component {
  state = {};

  componentWillMount() {}

  render(state: StateType, props: PropsType) {
    return (
      <div>
        component
      </div>
    );
  }
}
