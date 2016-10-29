import {Loader} from '../../components';
import React from 'react';
import {hashHistory} from 'react-router';
import ls from 'local-storage';
import radium from 'radium';
import request from 'request';
import styles from './styles';

@radium
export default class ProjectsView extends React.Component {

  state = {
    projects_fetched: false,
  };

  componentWillMount() {
    this.props.setViewTitle('Projects');
    if (this.props.showBack.clearOnClick) this.props.setShowBack(false);
  }

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
        <div style={styles.projectsWrapper}>
          {this.state.projects_fetched ? ls('pp-projects').map((project, projectIndex) => (
            <div key={projectIndex} style={styles.projectCard} onClick={() => {
              ls.set(`pp-project-${project.id}-details`, project);
              hashHistory.push(`/projects/${project.id}`)
            }}>
              <span style={styles.projectName}>{project.name}</span>
            </div>
          )) : (
            <Loader />
          )}
        </div>
      </div>
    );
  }
}
