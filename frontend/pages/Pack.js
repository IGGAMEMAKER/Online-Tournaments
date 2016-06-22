import { h, render } from 'preact';
import PackPage from '../components/PackPage';
import Layout from '../layouts/index';

const appElement: HTMLElement = document.getElementById('app');

const elements = (
  <Layout content={<PackPage />} nochat />
);

render(
  elements,
  appElement.parentNode,
  appElement
);
