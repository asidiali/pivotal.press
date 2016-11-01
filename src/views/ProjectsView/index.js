import {Icon, Loader} from '../../components';

import React from 'react';
import {hashHistory} from 'react-router';
import ls from 'local-storage';
import moment from 'moment';
import radium from 'radium';
import request from 'request';
import styles from './styles';

@radium
export default class ProjectsView extends React.Component {

  static propTypes = {
    setViewTitle: React.PropTypes.func,
    setViewColor: React.PropTypes.func,
    showBack: React.PropTypes.any,
    setShowBack: React.PropTypes.func,
  };

  state = {
    projects_fetched: false,
    projects_activity_fetched: false,
  };

  componentWillMount() {
    this.props.setViewTitle('Projects');
    this.props.setViewColor('#3E7293');
    if (this.props.showBack && this.props.showBack.clearOnClick) this.props.setShowBack(false);
  }

  componentDidMount() {
    if (ls('pp-api') && ls('pp-me')) {
      const headers = new Headers();
      headers.append('X-TrackerToken', ls('pp-api'));
      fetch('https://www.pivotaltracker.com/services/v5/projects', {
        mode: 'cors',
        headers,
        method: 'GET',
      }).then(res => res.json()).then((res) => {
        ls.set('pp-projects', res);
        this.setState({projects_fetched: true});

        // fetch activity for each project
        res.forEach((project) => {
          fetch(`https://www.pivotaltracker.com/services/v5/projects/${project.id}/activity?limit=5`, {
            mode: 'cors',
            headers,
            method: 'GET',
          }).then(response => response.json()).then((activityRes) => {
            ls.set(`pp-project-${project.id}-activity`, activityRes);
          });
        });

        this.setState({projects_activity_fetched: true});
      });
    }
  }

  render() {
    return (
      <div style={styles.base}>
        <div style={styles.projectsWrapper}>
          {(this.state.projects_fetched && this.state.projects_activity_fetched) ? ls('pp-projects').map((project, projectIndex) => {
            const projectColor = `#${ls('pp-me').projects.filter(proj => proj.project_id === project.id)[0].project_color}`;
            return (
              <div key={projectIndex} style={Object.assign({}, styles.projectCard, {
                borderLeft: `10px solid ${projectColor || 'rgb(62, 114, 147)'}`,
              })} onClick={() => {
                ls.set(`pp-project-${project.id}-details`, project);
                hashHistory.push(`/projects/${project.id}`);
              }}>
                <span style={styles.projectName}><Icon icon="assignment" style={{color: '#444', margin: 'auto 10px auto 0'}} /> {project.name}</span>
                <ul style={styles.projectActivityList}>
                  <li style={{color: '#aaa', fontSize: '0.8em', margin: '0 0 5px', textTransform: 'uppercase', fontWeight: 700}}>Recent Activity</li>
                  {ls(`pp-project-${project.id}-activity`) && ls(`pp-project-${project.id}-activity`).length ? ls(`pp-project-${project.id}-activity`).map((activity, activityIndex) => (
                    <li style={styles.projectActivityListItem} key={`activity-${activityIndex}`}>
                      <span style={styles.activityOccured}>{moment(activity.occurred_at).fromNow()}</span>
                      <span><Icon style={{ color: '#ccc', margin: 'auto 5px auto 0' }}icon={(activity.primary_resources[0].kind === 'story') ? typeIcons[activity.primary_resources[0].story_type] : 'assignment'} /></span>
                      <span style={{whiteSpace: 'nowrap', flex: 1, textOverflow: 'ellipsis'}}>{activity.message}</span>
                    </li>
                  )) : false}
                </ul>
              </div>
            );
          }) : (
            <div style={{ display: 'flex', height: '75vh', width: '100%', flexFlow: 'column nowrap', justifyContent: 'center', alignItems: 'center'}}>
              <Loader />
              <span style={{margin: '0px auto', fontSize: '0.8em', color: '#aaa', textTransform: 'uppercase', fontWeight: 700}}>Fetching projects</span>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const typeIcons = {
  all: 'group_work',
  feature: 'extension',
  bug: 'bug_report',
  chore: 'build',
  release: 'backup',
};
