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
