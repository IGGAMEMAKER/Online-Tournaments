import { h, Component } from 'preact';
import store from '../../stores/ProfileStore';
import actions from '../../actions/ProfileActions';
import Modal from '../Modal/Modal';

type PropsType = {}

type StateType = {}

type ResponseType = {}

export default class TestComponent extends Component {
  state = {};

  componentWillMount() {
    store.addChangeListener(() => {
      this.setState({
        value: store.getTestValue(),
      });
    });
  }

          // hide={state.value % 2 ? 1 : 0}
  render(props: PropsType, state: StateType) {
    return (
      <div>
        <button onClick={actions.testFunction}> Comp1 button {state.value}</button>
        <Modal
          data={{
            header: 'Header',
            body: 'Body',
            footer: 'footer',
          }}
        />
      </div>
    );
  }
}
