import { h, render } from 'preact';
import TournamentListAdmin from '../components/Tournaments/TournamentListAdmin';

const appElement: HTMLElement = document.getElementById('tournaments');

const elements = (
  <center>
    <TournamentListAdmin />
  </center>
);

render(
  elements,
  appElement.parentNode,
  appElement
);
