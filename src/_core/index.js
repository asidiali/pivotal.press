import {
  HomeView,
  ProjectsView,
} from '../views';
import {
  Route,
  Router,
  hashHistory,
} from 'react-router';

import App from './app';
import React from 'react';
import {render}             from 'react-dom';

function run() {
  render(
    <Router history={hashHistory}>
      <Route component={App}>
        <Route path="/" component={HomeView} />
        <Route path="/projects" component={ProjectsView} />
      </Route>
    </Router>,
    document.getElementById('app')
  );
}

const loadedStates = ['complete', 'loaded', 'interactive'];
if (loadedStates.includes(document.readyState) && document.body) {
  run();
} else {
  window.addEventListener('DOMContentLoaded', run, false);
}
