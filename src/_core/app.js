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
    stories: [],
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
      stories: [],
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

  fetchProjects = (callback) => {
    const me = ls('pp-me');
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

  fetchProjectStories = (projectId, callback) => {
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
    fetch(`https://www.pivotaltracker.com/services/v5/projects/${projectId}/stories?limit=1000`, {
      mode: 'cors',
      headers,
      method: 'GET',
    }).then(res => res.json()).then((res) => {
      if (this.state.stories !== res) this.setState({ stories: res });
      if (callback) callback(res);
    });

    fetch(`https://www.pivotaltracker.com/services/v5/projects/${projectId}/memberships`, {
      mode: 'cors',
      headers,
      method: 'GET',
    }).then(res => res.json()).then((res) => {
      this.setState({ project_memberships: res });
    });

    fetch(`https://www.pivotaltracker.com/services/v5/projects/${projectId}/labels`, {
      mode: 'cors',
      headers,
      method: 'GET',
    }).then(res => res.json()).then((res) => {
      this.setState({project_labels: res });
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
    if (projects.length) {
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
              viewTitle={this.state.viewTitle}
              viewColor={this.state.viewColor}
              viewCount={this.state.viewCount}
              showBack={this.state.showBack}
              setViewTitle={this.setViewTitle}
              setViewColor={this.setViewColor}
              setViewCount={this.setViewCount}
              setShowBack={this.setShowBack}
              location={this.props.location}
            />
            {React.cloneElement(this.props.children, {
              setViewTitle: this.setViewTitle,
              setViewColor: this.setViewColor,
              setViewCount: this.setViewCount,
              viewColor: this.state.viewColor,
              setShowBack: this.setShowBack,
              showBack: this.state.showBack,
              setNotification: this.setNotification,
              projects: this.state.projects,
              activity: this.state.activity,
              fetchProjects: this.fetchProjects,
              fetchAllActivity: this.fetchAllActivity,
              fetchProjectStories: this.fetchProjectStories,
              fetchProjectActivity: this.fetchProjectActivity,
              stories: this.state.stories,
              project_labels: this.state.project_labels,
              project_memberships: this.state.project_memberships,
              project_activity: this.state.project_activity,
              clearProjectData: this.clearProjectData,
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
