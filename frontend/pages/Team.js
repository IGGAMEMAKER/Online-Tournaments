import { h, render } from 'preact';
import TeamTab from '../components/TeamTab';

const appElement: HTMLElement = document.getElementById('app');

const brdr = '-----------------------------------------------';
const team = {
  name: 'КрутыеКексы',
  players: [
    { name: 'Гага' },
    { name: 'Гага1' },
    { name: 'Гага2' },
  ],
  captain: 'Гага',
  money: 100,
  settings: {},
};

const elements = (
  <center>
    <TeamTab />
  </center>
);

render(
  elements,
  appElement.parentNode,
  appElement
);
