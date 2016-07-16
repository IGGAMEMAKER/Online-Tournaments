import { h, render } from 'preact';
import Profile from '../components/Profile';
import Layout from '../layouts/index';

const appElement: HTMLElement = document.getElementById('app');

const elements = (
  <Layout content={<Profile />} nochat active="Profile" />
);

render(
  elements,
  appElement.parentNode,
  appElement
);
