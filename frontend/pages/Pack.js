import { h, render, Component } from 'preact';
import Packs from '../components/PackPage';
import Layout from '../layouts/index';

export default class PackPage extends Component {
  render() {
    return <Layout content={<Packs />} nochat active="Packs" />
  }
}
