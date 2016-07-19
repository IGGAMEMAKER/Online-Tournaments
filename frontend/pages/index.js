import { h, render, Component } from 'preact';
import { Router, Route, IndexRoute, browserHistory } from 'preact-router';

const appElement: HTMLElement = document.getElementById('app');
import * as Pages from './Pages';
//     <Pages.Home default />
const Routing = (): Component => (
  <Router history={browserHistory}>
    <Pages.Home path="/" />
    <Pages.Tournaments path="/Tournaments" />
    <Pages.Packs path="/Packs" />
    <Pages.Profile path="/Profile" />
    <Pages.About path="/About" />
    <Pages.Payment path="/Payment" />
  </Router>
);
// <Pages.Tournaments path="/Tournaments" />
// <Pages.Packs path="/Packs" />
// <Pages.Profile path="/Profile" />
// <Pages.Error404 default />

render(
  <Routing />,
  appElement.parentNode,
  appElement
);
