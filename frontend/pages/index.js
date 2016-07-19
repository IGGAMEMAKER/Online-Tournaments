import { h, render, Component } from 'preact';
import Router from 'preact-router';

const appElement: HTMLElement = document.getElementById('app');
import * as Pages from './Pages';

const Routing = (): Component => (
  <Router>
    <Pages.Home path="/" />
    <Pages.Tournaments path="/Tournaments" />
    <Pages.Packs path="/Packs" />
    <Pages.Profile path="/Profile" />
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
