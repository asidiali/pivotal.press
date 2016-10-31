import {
  HomeView,
  Layout,
  ProjectStoriesView,
  ProjectsView,
} from '../views';
import {
  Route,
  Router,
  hashHistory,
} from 'react-router';

import App from './app';
import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import ls from 'local-storage';
import {render}             from 'react-dom';

injectTapEventPlugin();

function requireAuth() {
  if (!ls('pp-api') || !ls('pp-me')) setTimeout(hashHistory.push('/'), 500);
}

function main() {
  render(
    <Router history={hashHistory}>
      <Route component={App}>
        <Route path="/" component={HomeView} />
        <Route component={Layout} onEnter={requireAuth}>
          <Route path="/projects" component={ProjectsView} />
          <Route path="/projects/:projectId" component={ProjectStoriesView} />
        </Route>
      </Route>
    </Router>,
    document.getElementById('app')
  );
}

const loadedStates = ['complete', 'loaded', 'interactive'];
if (loadedStates.includes(document.readyState) && document.body) {
  main();
} else {
  document.addEventListener('DOMContentLoaded', main, false);
}

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-86630001-1', 'auto');
ga('send', 'pageview');
