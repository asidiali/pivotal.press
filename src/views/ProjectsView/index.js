import React from 'react';
import {hashHistory} from 'react-router';
import ls from 'local-storage';
import request from 'request';
import styles from './styles';

export default class ProjectsView extends React.Component {

  state = {
    projects_fetched: false,
  };

  componentDidMount() {
    const headers = new Headers();
    headers.append('X-TrackerToken', ls('pp-api'));
    fetch('https://www.pivotaltracker.com/services/v5/projects', {
      mode: 'cors',
      headers,
      method: 'GET',
    }).then(res => res.json()).then((res) => {
      ls.set('pp-projects', res);
      this.setState({projects_fetched: true});
    });
  }

  render() {
    return (
      <div style={styles.base}>
        <h1 style={styles.viewTitle}>Projects</h1>
        <div style={styles.projectsWrapper}>
          {this.state.projects_fetched ? ls('pp-projects').map((project, projectIndex) => (
            <div key={projectIndex} style={styles.projectCard} onClick={() => {
              ls.set(`pp-project-${project.id}-details`);
              hashHistory.push(`/projects/${project.id}`)
            }}>
              {project.name}
            </div>
          )) : false}
        </div>
      </div>
    );
  }
}
