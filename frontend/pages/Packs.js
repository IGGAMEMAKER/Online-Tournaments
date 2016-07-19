import { h, render, Component } from 'preact';
import Packs from '../components/Packs';
import Layout from '../layouts/index';

export default class PackPage extends Component {
  render() {
    console.log('PackPage page');
    // return <div>aaaa</div>;
    return <Layout content={<Packs />} nochat active="Packs" />
  }
}
