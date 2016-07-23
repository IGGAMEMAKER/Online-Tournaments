import { h, render, Component } from 'preact';
import Support from '../components/Activity/Support';
import Layout from '../layouts/index';

export default class SupportPage extends Component {
  render() {
    return <Layout content={<Support />} active="Support" nochat />
  }
}
