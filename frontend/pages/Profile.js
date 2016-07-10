import { h, render } from 'preact';
import Profile from '../components/Profile';
import Layout from '../layouts/index';

const appElement: HTMLElement = document.getElementById('app');

const elements = (
  <Layout content={<Profile />} nochat />
);

render(
  elements,
  appElement.parentNode,
  appElement
);
