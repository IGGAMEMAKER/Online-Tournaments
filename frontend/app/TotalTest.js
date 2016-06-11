import { h, render } from 'preact';
import Tournaments from '../components/Tournaments';
import Team from '../components/Team/TeamDraw';
import Payment from '../components/Payments/index';
import Chat from '../components/Activity/Chat';
import PackPage from '../components/PackPage';

const appElement: HTMLElement = document.getElementById('app');

const elements = (
  <center>
    <Chat />
    <Payment />
    <Tournaments />
    <Team />
    <PackPage />
  </center>
);

render(
  elements,
  appElement.parentNode,
  appElement
);
