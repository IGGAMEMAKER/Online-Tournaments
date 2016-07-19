import { h, render, Component } from 'preact';
import About from '../components/About';
import Layout from '../layouts/index';

const elements = (
  <Layout content={<About />} nochat active="About" />
);

export default class ProfilePage extends Component {
  render() {
    return elements;
  }
}
