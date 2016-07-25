import { h, render, Component } from 'preact';
import Demo from '../components/Demo';
import Layout from '../layouts/index';

export default class DemoPage extends Component {
  render() {
    return (
      <div style="margin-top: -80px;">
        <Layout content={<Demo variant={1} />} noheader nofooter nochat />
      </div>
    );
  }
}
