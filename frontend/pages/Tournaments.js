import { h, render, Component } from 'preact';
import Tournaments from '../components/Tournaments';
import Layout from '../layouts/index';

export default class TournamentPage extends Component {
  render(props) {
    
    return <Layout content={<Tournaments filter={props.filter || 0} />} chat active="Tournaments" />
  }
}
