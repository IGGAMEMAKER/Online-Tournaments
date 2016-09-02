import { h, render } from 'preact';
import TournamentListAdmin from '../components/Tournaments/TournamentListAdmin';
import AdminStats from '../components/Stats/AdminStats';

const appElement: HTMLElement = document.getElementById('tournaments');

const elements = (
  <center>
    <AdminStats />

    <TournamentListAdmin />
  </center>
);

render(
  elements,
  appElement.parentNode,
  appElement
);
