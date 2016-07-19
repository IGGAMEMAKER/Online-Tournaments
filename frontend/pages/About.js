import { h, render, Component } from 'preact';
import About from '../components/About';
import Layout from '../layouts/index';

export default class ProfilePage extends Component {
  render() {
    return <Layout content={<About />} nochat active="About" />;
  }
}
