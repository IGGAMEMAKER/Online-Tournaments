import { h, render } from 'preact';
import Tournaments from '../components/Tournaments';

const appElement: HTMLElement = document.getElementById('app');

const elements = (
  <center>
    <Tournaments />
  </center>
);

render(
  elements,
  appElement.parentNode,
  appElement
);
