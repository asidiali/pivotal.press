import React from 'react';
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
      this.setState({projects_fetched: true});
      ls.set('pp-projects', res);
    });
  }

  render() {
    return (
      <div style={styles.base}>
        my projects
        {ls('pp-projects').length ? ls('pp-projects').map(project => (
          <div>
            {project.name}
          </div>
        )) : false}
      </div>
    );
  }
}
