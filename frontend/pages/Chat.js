import { h, render, Component } from 'preact';
import Chat from '../components/Activity/Chat';
import Layout from '../layouts/index';

export default class ChatPage extends Component {
  render() {
    return <Layout content={<Chat />} active="Packs" />
  }
}
