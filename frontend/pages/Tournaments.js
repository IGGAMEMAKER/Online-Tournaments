import { h, render } from 'preact';
import Tournaments from '../components/Tournaments';
import Layout from '../layouts/index';

const appElement: HTMLElement = document.getElementById('app');

const elements = (
  <Layout content={<Tournaments />} chat />
);

render(
  elements,
  appElement.parentNode,
  appElement
);
