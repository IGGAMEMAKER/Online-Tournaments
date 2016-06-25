import { h, render } from 'preact';
// import Chat from '../../components/Activity/Chat';
import Football from '../../games/Football/Football';
import Layout from '../../layouts/index';

const appElement: HTMLElement = document.getElementById('app');

const elements = (
  <Layout content={<Football />} chat nomodals nofooter noheader />
);
// const elements = (
//   <center>
//     <Football />
//     <Chat />
//   </center>
// );

render(
  elements,
  appElement.parentNode,
  appElement
);
