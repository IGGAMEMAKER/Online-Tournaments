import { h, render } from 'preact';
import TournamentAdmin from '../components/Tournaments/TournamentAdmin';

const appElement: HTMLElement = document.getElementById('tournaments');

const elements = (
  <center>
    <TournamentAdmin />
  </center>
);

render(
  elements,
  appElement.parentNode,
  appElement
);
