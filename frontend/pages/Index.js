import { h, render } from 'preact';
import Index from '../components/Index';
import Layout from '../layouts/index';

const appElement: HTMLElement = document.getElementById('app');

const elements = (
  <Layout content={<Index />} nochat nofooter />
);

render(
  elements,
  appElement.parentNode,
  appElement
);
