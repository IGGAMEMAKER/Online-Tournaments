import { h, render, Component } from 'preact';
import Realmadrid from '../../components/Tournaments/Specials/Realmadrid';
import Layout from '../../layouts/index';

export default class RealmadridPage extends Component {
  render() {
    return <Layout content={<Realmadrid />} nochat active="Index" />
  }
}
