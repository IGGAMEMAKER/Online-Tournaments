import { h, render } from 'preact';
import Tournaments from '../components/Tournaments';
import Team from '../components/Team/TeamDraw';
import Payment from '../components/Payments/index';
import Chat from '../components/Activity/Chat';
import PackPage from '../components/PackPage';
import Index from '../components/Index';

const appElement: HTMLElement = document.getElementById('app');

const elements = (
  <center>
    <Chat />
    <Payment />
    <Team />
    <PackPage />
    <Index />
    <Tournaments />
  </center>
);

render(
  elements,
  appElement.parentNode,
  appElement
);
