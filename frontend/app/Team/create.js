import { h, render } from 'preact';
// import Fish from '../../components/fish';
import TeamTab from '../../components/TeamTab';


const appElement: HTMLElement = document.getElementById('app');
console.log('ololo create works');

// const elements = (
//   <Fish text="txt" />
// );
const elements = (
  <TeamTab joined={false} team={{}} />
);

render(
  elements,
  appElement.parentNode,
  appElement
);
