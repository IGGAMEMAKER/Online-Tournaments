import { h, render, Component } from 'preact';
import Demo from '../components/Demo';
import Layout from '../layouts/index';

export default class DemoPage extends Component {
  render(props) {
    console.log('DemoPage', props);
    return (
      <div style="margin-top: -80px;">
        <Layout content={<Demo name={props.link} id={props.id} />} noheader nofooter nochat />
      </div>
    );
  }
}
