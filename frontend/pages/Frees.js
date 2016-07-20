import { h, render, Component } from 'preact';
import Tournaments from '../components/Tournaments';
import Layout from '../layouts/index';
import constants from '../constants/constants';

export default class FreesPage extends Component {
  render() {
    return <Layout content={<Tournaments filter={constants.TOURNAMENT_FILTER_FREE} />} chat active="Tournaments" />
  }
}
