import React from 'react';
import ls from 'local-storage';
import request from 'request';
import styles from './styles';

export default class ProjectStoriesView extends React.Component {

  state = {
    project_stories_fetched: false,
  };

  componentDidMount() {
    const headers = new Headers();
    const projectId = this.props.params.projectId;
    headers.append('X-TrackerToken', ls('pp-api'));
    if (ls(`pp-project-${this.props.params.projectId}-stories`)) {
      this.setState({project_stories_fetched: true});
    } else {
      fetch(`https://www.pivotaltracker.com/services/v5/projects/${projectId}/stories`, {
        mode: 'cors',
        headers,
        method: 'GET',
      }).then(res => res.json()).then((res) => {
        ls.set(`pp-project-${projectId}-stories`, res);
        this.setState({project_stories_fetched: true});
      });
    }
  }

  render() {
    console.log(this.props.params.projectId);
    return (
      <div style={styles.base}>
        stories
        <div style={styles.storiesWrapper}>
          {this.state.project_stories_fetched ? ls(`pp-project-${this.props.params.projectId}-stories`).map(project => (
            <div style={styles.storyCard}>
              {project.name}
            </div>
          )) : false}
        </div>
      </div>
    );
  }
}
