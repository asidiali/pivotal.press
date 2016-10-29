import React from 'react';
import {hashHistory} from 'react-router';
import ls from 'local-storage';
import moment from 'moment';
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
        <span onClick={() => hashHistory.push('/projects')}>&lt; Projects</span>
        <h3>Stories</h3>
        <div style={styles.storiesWrapper}>
          {this.state.project_stories_fetched ? ls(`pp-project-${this.props.params.projectId}-stories`).map((story, storyIndex) => (
            <div key={storyIndex} style={styles.storyCard}>
              {story.name}
              <span>Last updated {moment(story.updated_at).fromNow()}</span>
            </div>
          )) : false}
        </div>
      </div>
    );
  }
}
