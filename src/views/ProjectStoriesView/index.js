import {
  Icon,
  Loader,
  StoryCard,
} from '../../components';

import React from 'react';
import {hashHistory} from 'react-router';
import ls from 'local-storage';
import moment from 'moment';
import radium from 'radium';
import request from 'request';
import styles from './styles';

function sortStoriesByCreatedTime(a, b) {
  return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
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
    this.props.setShowBack({
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
      ls.set(`pp-project-${projectId}-stories`, res);
      this.setState({project_stories_fetched: true});
    });
  }

  render() {
    console.log(this.props.params.projectId);
    return (
      <div style={styles.base}>
        <div style={styles.storiesWrapper}>
          {this.state.project_stories_fetched ? ls(`pp-project-${this.props.params.projectId}-stories`).sort(sortStoriesByCreatedTime).map((story, storyIndex) => (
            <StoryCard
              key={storyIndex}
              story={story}
              storyIndex={storyIndex}
            />
          )) : (
            <Loader />
          )}
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

const statuses = [
  'unscheduled',
  'unstarted',
  'started',
  'finished',
  'delivered',
  'rejected',
  'accepted',
];

const statusColors = {
  unscheduled: {
    text: '#888',
    bg: '#eee',
  },
  unstarted: {
    text: '#eee',
    bg: '#888',
  },
  started: {
    text: '#fff',
    bg: '#444',
  },
  finished: {
    text: '#fff',
    bg: '#3E7293',
  },
  delivered: {
    text: '#fff',
    bg: '#09a3ed',
  },
  accepted: {
    text: '#fff',
    bg: '#1bb23a',
  },
  rejected: {
    text: '#fff',
    bg: 'red',
  },
};
