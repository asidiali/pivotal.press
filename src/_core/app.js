import React, {PropTypes} from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Nav} from '../components';
import { Snackbar } from 'material-ui';
import {StyleRoot} from 'radium';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import ls from 'local-storage';
import styles from './styles';

class App extends React.Component {

  static propTypes = {
    children: PropTypes.node,
  };

  state = {
    viewTitle: '',
    viewColor: '',
    viewCount: 0,
    showBack: false,
    notification: {
      show: false,
      message: '',
      action: '',
      onClick: null,
    },
    activity: {},
    projects: [],
    me: {},
    stories_loaded: false,
    unscheduled_stories: [],
    unstarted_stories: [],
    started_stories: [],
    finished_stories: [],
    delivered_stories: [],
    rejected_stories: [],
    accepted_stories: [],
    project_labels: [],
    project_memberships: [],
    project_activity: [],
  };

  componentDidMount() {
    const self = this;
    self.fetchProjects();

    // self.fetchAllActivity();

    // (function getActivity() {
    //   setTimeout(() => {
    //     self.fetchAllActivity(() => getActivity());
    //   }, 10000);
    // }());
  }

  clearProjectData = () => {
    this.setState({
      stories_loaded: false,
      unscheduled_stories: [],
      unstarted_stories: [],
      started_stories: [],
      finished_stories: [],
      delivered_stories: [],
      rejected_stories: [],
      accepted_stories: [],
      project_labels: [],
      project_memberships: [],
      project_activity: [],
    });
  }

  setViewTitle = viewTitle => this.setState({ viewTitle });
  setViewCount = viewCount => this.setState({ viewCount });

  setViewColor = viewColor => this.setState({ viewColor });

  setShowBack = showBack => this.setState({ showBack });

  setNotification = (show, message, action, onClick) => {
    if (!show) {
      const notification = this.state.notification;
      notification.show = false;
      return this.setState({
        notification
      });
    }
    if (!message) return false;
    const options = {
      show: true,
      message,
    };
    if (action) options.action = action;
    if (onClick) options.onClick = onClick;
    return this.setState({ notification: options });
  }

  fetchMe = (key, callback) => {
    const component = this;
    const headers = new Headers();
    ls.set('pp-api', key);
    headers.append('X-TrackerToken', key);
    // TODO paginate requests
    fetch(`https://www.pivotaltracker.com/services/v5/me`, {
      mode: 'cors',
      headers,
      method: 'GET',
    }).then(res => res.json()).then((res) => {
      if (res.kind === 'error') return alert('Invalid API key. Please check your key and try again.');
      ls.set(`pp-me`, res);
      component.setState({ me: res });
      callback();
    });
  }

  fetchProjects = (callback) => {
    const me = this.state.me;
    const key = ls('pp-api');

    if (!key || !me) return console.log('error - not authenticated to fetch project data (func: fetchProjects)');

    const headers = new Headers();
    headers.append('X-TrackerToken', key);
    fetch('https://www.pivotaltracker.com/services/v5/projects', {
      mode: 'cors',
      headers,
      method: 'GET',
    }).then(res => res.json()).then((res) => {
      // ls.set('pp-projects', res);
      this.setState({ projects: res });
      if (callback) callback(res);
    });
  }

  fetchProjectStories = (projectId, projectState, callback) => {
    const me = ls('pp-me');
    const key = ls('pp-api');

    if (!key || !me) return console.log('error - not authenticated to fetch project data (func: fetchProjectActivity)');

    const projectColor = `#${ls('pp-me').projects.filter(proj => proj.project_id === parseInt(projectId))[0].project_color}`;
    this.setViewColor(projectColor);

    const headers = new Headers();
    headers.append('X-TrackerToken', ls('pp-api'));
    this.setViewTitle(ls(`pp-project-${projectId}-details`).name);
    this.setShowBack({
      link: '/projects',
      text: 'Projects',
      clearOnClick: true,
    });
    // TODO paginate requests
    fetch(`https://www.pivotaltracker.com/services/v5/projects/${projectId}/stories?with_state=${projectState}&limit=1000`, {
      mode: 'cors',
      headers,
      method: 'GET',
    }).then(res => res.json()).then((res) => {
      const state = {};
      state[`${projectState}_stories`] = res;
      this.setState(state);
      if (callback) callback(res);
    });
  }

  markStoriesAsLoaded = () => this.setState({ stories_loaded: true });

  fetchProjectLabels = (projectId) => {
    const headers = new Headers();
    headers.append('X-TrackerToken', ls('pp-api'));
    fetch(`https://www.pivotaltracker.com/services/v5/projects/${projectId}/labels`, {
      mode: 'cors',
      headers,
      method: 'GET',
    }).then(res => res.json()).then((res) => {
      this.setState({project_labels: res });
    });
  }

  fetchProjectMemberships = (projectId) => {
    const headers = new Headers();
    headers.append('X-TrackerToken', ls('pp-api'));
    fetch(`https://www.pivotaltracker.com/services/v5/projects/${projectId}/memberships`, {
      mode: 'cors',
      headers,
      method: 'GET',
    }).then(res => res.json()).then((res) => {
      this.setState({ project_memberships: res });
    });
  }

  // fetchProjectMembers = (projectId) => {}
  fetchProjectActivity = (projectId, callback) => {
    const me = ls('pp-me');
    const key = ls('pp-api');

    if (!key || !me) return console.log('error - not authenticated to fetch project data (func: fetchProjectActivity)');

    const headers = new Headers();
    headers.append('X-TrackerToken', key);
    fetch(`https://www.pivotaltracker.com/services/v5/projects/${projectId}/activity?limit=15`, {
      mode: 'cors',
      headers,
      method: 'GET',
    }).then(response => response.json()).then((activityRes) => {
      this.setState({ project_activity: activityRes });
      if (callback) callback(activityRes);
    });
  }

  fetchAllActivity = (callback) => {
    const me = ls('pp-me');
    const key = ls('pp-api');

    const projects = ls('pp-projects');

    if (!key || !me) return console.log('error - not authenticated to fetch project data (func: fetchProjectActivity)');
    const self = this;
    if (projects && projects.length) {
      const activity = {};
      projects.forEach((project, projectI) => {
        const headers = new Headers();
        headers.append('X-TrackerToken', key);
        fetch(`https://www.pivotaltracker.com/services/v5/projects/${project.id}/activity?limit=5`, {
          mode: 'cors',
          headers,
          method: 'GET',
        }).then(response => response.json()).then((activityRes) => {
          activity[project.id] = activityRes;
          if (projects.length === projectI + 1) {
            // ls.set('pp-activity', activity);
            self.setState({ activity: activity });
            if (callback) callback(activity);
          }
          // console.log(activity);
        });
      });

    }
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <StyleRoot>
          <div style={styles.base}>
            <Nav
              location={this.props.location}
              setShowBack={this.setShowBack}
              setViewColor={this.setViewColor}
              setViewCount={this.setViewCount}
              setViewTitle={this.setViewTitle}
              showBack={this.state.showBack}
              viewColor={this.state.viewColor}
              viewCount={this.state.viewCount}
              viewTitle={this.state.viewTitle}
            />
            {React.cloneElement(this.props.children, {
              accepted_stories: this.state.accepted_stories,
              activity: this.state.activity,
              clearProjectData: this.clearProjectData,
              delivered_stories: this.state.delivered_stories,
              fetchAllActivity: this.fetchAllActivity,
              fetchMe: this.fetchMe,
              fetchProjectActivity: this.fetchProjectActivity,
              fetchProjectLabels: this.fetchProjectLabels,
              fetchProjectMemberships: this.fetchProjectMemberships,
              fetchProjects: this.fetchProjects,
              fetchProjectStories: this.fetchProjectStories,
              finished_stories: this.state.finished_stories,
              markStoriesAsLoaded: this.markStoriesAsLoaded,
              me: this.state.me,
              project_activity: this.state.project_activity,
              project_labels: this.state.project_labels,
              project_memberships: this.state.project_memberships,
              projects: this.state.projects,
              rejected_stories: this.state.rejected_stories,
              setNotification: this.setNotification,
              setShowBack: this.setShowBack,
              setViewColor: this.setViewColor,
              setViewCount: this.setViewCount,
              setViewTitle: this.setViewTitle,
              showBack: this.state.showBack,
              stories_loaded: this.state.stories_loaded,
              started_stories: this.state.started_stories,
              unscheduled_stories: this.state.unscheduled_stories,
              unstarted_stories: this.state.unstarted_stories,
              viewColor: this.state.viewColor,
            })}
            <Snackbar
              open={this.state.notification.show}
              message={this.state.notification.message}
              onActionTouchTap={this.state.notification.onClick}
              action={this.state.notification.action}
              autoHideDuration={4000}
              onRequestClose={() => this.setNotification()}
            />
          </div>
        </StyleRoot>
      </MuiThemeProvider>
    );
  }
}

export default App;
