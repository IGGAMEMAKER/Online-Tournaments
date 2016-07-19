import { h, render, Component } from 'preact';
import Profile from '../components/Profile';
import Layout from '../layouts/index';

const elements = (
  <Layout content={<Profile />} nochat active="Profile" />
);

export default class ProfilePage extends Component {
  render() {
    return elements;
  }
}
