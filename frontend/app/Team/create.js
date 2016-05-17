import { h, render } from 'preact';
import Fish from '../../components/fish';

const appElement: HTMLElement = document.getElementById('app');
console.log("ololo create works");

const elements = (
  <Fish text="txt" />
);

render(
  elements,
  appElement.parentNode,
  appElement
);
