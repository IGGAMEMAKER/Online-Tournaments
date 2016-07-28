import { h, render, Component } from 'preact';
import { Router, Route, IndexRoute, browserHistory } from 'preact-router';

const appElement: HTMLElement = document.getElementById('app');
import * as Pages from './PagesAdmin';

const Routing = (): Component => (
  <Router history={browserHistory}>
    <Pages.Packs path="/admin/packs" />
    <Pages.Support path="/admin/support" />
    <Pages.SupportChat path="/admin/support-chat" />
  </Router>
);

render(
  <Routing />,
  appElement.parentNode,
  appElement
);
