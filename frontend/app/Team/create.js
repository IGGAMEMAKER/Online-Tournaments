import { h, render } from 'preact';
// import Fish from '../../components/fish';
import TeamTab from '../../components/TeamTab';


const appElement: HTMLElement = document.getElementById('app');
console.log('ololo create works');

// const elements = (
//   <Fish text="txt" />
// );
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
/*
 <TeamTab joined={1} team={team} />
 <p>{brdr}{brdr}</p>
 <TeamTab joined={2} team={{}} />

 */
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
