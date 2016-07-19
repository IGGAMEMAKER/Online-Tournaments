import { h, render, Component } from 'preact';
import Index from '../components/Index';
import Layout from '../layouts/index';

export default class Home extends Component {
    render() {
        return <Layout content={<Index />} nochat nofooter active="Index" />
    }
}