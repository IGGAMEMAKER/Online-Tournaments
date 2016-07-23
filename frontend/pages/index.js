import { h, render, Component } from 'preact';
import { Router, Route, IndexRoute, browserHistory } from 'preact-router';

const appElement: HTMLElement = document.getElementById('app');
import * as Pages from './Pages';

const scrollBehaviour = {
  updateScrollPosition: function updateScrollPosition() {
    console.log('updateScrollPosition');

    var hash = window.location.hash;
    if (hash) {
      var element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView();
      }
    } else {
      window.scrollTo(0, 0);
    }
  }
};

function hashLinkScroll() {
  const { hash } = window.location;
  console.log('on update router');
  if (hash !== '') {
    // Push onto callback queue so it runs after the DOM is updated,
    // this is required when navigating from a different page so that
    // the element is rendered on the page before trying to getElementById.
    setTimeout(() => {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) element.scrollIntoView();
    }, 0);
  }
}

/*

 history={browserHistory}
 onUpdate={hashLinkScroll}
 // scrollBehavior={scrollBehaviour}
 */
/*
 <Pages.Home path="/" />
 <Pages.Tournaments path="/Tournaments" />
 <Pages.Packs path="/Packs" />
 <Pages.Profile path="/Profile" />
 <Pages.About path="/About" />
 <Pages.Payment path="/Payment" />
 <Pages.Chat path="/Chat" />

 */
const Routing = (): Component => (
  <Router
    history={browserHistory}
  >
    <Pages.Home path="/" />

    <Pages.Tournaments path="/Tournaments" />
    <Pages.Frees path="/Frees" />
    <Pages.Elite path="/Elite" />
    <Pages.Crowd path="/Crowd" />
    <Pages.Support path="/Support" />

    <Pages.Packs path="/Packs" />
    <Pages.Profile path="/Profile" />
    <Pages.About path="/About" />
    <Pages.Payment path="/Payment" />
    <Pages.Chat path="/Chat" />
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
