import {
  Icon,
} from '../../components';
import React from 'react';
import {hashHistory} from 'react-router';
import ls from 'local-storage';
import moment from 'moment';
import radium from 'radium';
import request from 'request';
import styles from './styles';

function sortStoriesByCreatedTime(a, b) {
  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
}

@radium
export default class ProjectStoriesView extends React.Component {

  state = {
    project_stories_fetched: false,
  };

  componentDidMount() {
    const headers = new Headers();
    const projectId = this.props.params.projectId;
    headers.append('X-TrackerToken', ls('pp-api'));
    this.props.setViewTitle(ls(`pp-project-${projectId}-details`).name);
    // TODO paginate requests
    fetch(`https://www.pivotaltracker.com/services/v5/projects/${projectId}/stories?limit=1000`, {
      mode: 'cors',
      headers,
      method: 'GET',
    }).then(res => res.json()).then((res) => {
      ls.set(`pp-project-${projectId}-stories`, res);
      this.setState({project_stories_fetched: true});
    });
  }

  render() {
    console.log(this.props.params.projectId);
    return (
      <div style={styles.base}>
        <span onClick={() => hashHistory.push('/projects')}>&lt; Projects</span>
        <h3>Stories</h3>
        <div style={styles.storiesWrapper}>
          {this.state.project_stories_fetched ? ls(`pp-project-${this.props.params.projectId}-stories`).sort(sortStoriesByCreatedTime).map((story, storyIndex) => (
            <div key={storyIndex} style={styles.storyCard}>
              <ul style={styles.storyDetails}>
                <li style={styles.storyDetail}>
                  <Icon icon={typeIcons[story.story_type]} style={{ marginRight: 5 }} />
                  {story.story_type}
                </li>
                <li style={styles.storyDetail}>{story.current_state}</li>
              </ul>
              <p style={styles.storyName}>{story.name}</p>
              <span style={styles.lastUpdated}>Last updated {moment(story.updated_at).fromNow()}</span>
            </div>
          )) : false}
        </div>
      </div>
    );
  }
}

const typeIcons = {
  feature: 'extension',
  bug: 'bug_report',
  chore: 'build',
  release: 'backup',
};

const statusIcons = {

};
