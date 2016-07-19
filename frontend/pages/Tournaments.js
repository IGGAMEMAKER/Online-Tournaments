import { h, render, Component } from 'preact';
import Tournaments from '../components/Tournaments';
import Layout from '../layouts/index';

export default class TournamentPage extends Component {
  render() {
    return <Layout content={<Tournaments />} chat active="Tournaments" />
  }
}
