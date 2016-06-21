import { h, render } from 'preact';
import Leagues from '../components/Leagues';

const appElement: HTMLElement = document.getElementById('app');

const elements = (
  <center>
    <Leagues />
  </center>
);

render(
  elements,
  appElement.parentNode,
  appElement
);
