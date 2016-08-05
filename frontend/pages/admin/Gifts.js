import AdminLayout from '../../layouts/admin';
import AdminGifts from '../../components/Gifts/AdminGifts';
import { h, Component } from 'preact';

export default class Gifts extends Component {
  state = {};

  componentWillMount() {}

  render(state: StateType, props: PropsType) {
    return <AdminLayout content={<AdminGifts />} />;
  }
}
