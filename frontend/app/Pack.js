import { h, render } from 'preact';
import PackPage from '../components/PackPage';

const appElement: HTMLElement = document.getElementById('app');

const elements = (
  <center>
    <PackPage />
  </center>
);

render(
  elements,
  appElement.parentNode,
  appElement
);
