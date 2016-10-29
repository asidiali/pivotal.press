import {
  DropDownMenu,
  MenuItem,
} from 'material-ui';
import {
  Icon,
  Loader,
  StoryCard,
} from '../../components';

import Clipboard from 'clipboard';
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
    project_memberships_fetched: false,
    searchFilter: '',
    storyTypeFilter: 'all',
    ownerFilter: 'all',
  };

  componentDidMount() {

    const CB = new Clipboard('.storyId');

    CB.on('success', (e) => {
        this.props.setNotification(true, `${e.text} copied to clipboard`);
    });


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

    fetch(`https://www.pivotaltracker.com/services/v5/projects/${projectId}/memberships`, {
      mode: 'cors',
      headers,
      method: 'GET',
    }).then(res => res.json()).then((res) => {
      ls.set(`pp-project-${projectId}-memberships`, res);
      this.setState({project_memberships_fetched: true});
    });
  }

  filterBySearch = story => {
    const reg = new RegExp(this.state.searchFilter, 'i', 'g');
    return story.name.match(reg);
  }

  filterByType = story => {
    if (this.state.storyTypeFilter === 'all') return true;
    return story.story_type === this.state.storyTypeFilter;
  }

  handleStoryTypeChange = (e, t, val) => this.setState({ storyTypeFilter: val });

  handleOwnerChange = (e, t, val) => this.setState({ ownerFilter: val });

  render() {
    console.log(this.props.params.projectId);
    return (
      <div style={styles.base}>
        <div style={styles.filtersWrapper}>
          <div style={styles.searchInputWrapper}>
            <Icon icon="search" style={styles.searchIcon} />
            <input
              placeholder="search stories"
              style={styles.searchInput}
              onKeyUp={(e) => {
                this.setState({ searchFilter: e.currentTarget.value });
              }}
            />
          </div>
          <Icon icon={typeIcons[this.state.storyTypeFilter]} style={{ fontSize: '1.25em', color: '#fff', margin: 'auto 0 auto 20px'}} />
          <DropDownMenu
            underlineStyle={{
              margin: 0,
              borderTop: '2px solid rgba(0,0,0,0.15)',
              display: 'none',
            }}
            labelStyle={{
              paddingLeft: 10,
              fontSize: '1em',
              color: '#fff',
              fontWeight: 700,
            }}
            style={{ margin: 'auto 0', height: 'auto' }}
            value={this.state.storyTypeFilter}
            onChange={this.handleStoryTypeChange}
          >
            <MenuItem leftIcon={<Icon icon="group_work" />} value='all' primaryText="All Types" />
            <MenuItem leftIcon={<Icon icon="bug_report" />} value='bug' primaryText="Bugs" />
            <MenuItem leftIcon={<Icon icon="build" />} value='chore' primaryText="Chores" />
            <MenuItem leftIcon={<Icon icon="extension" />} value='feature' primaryText="Features" />
            <MenuItem leftIcon={<Icon icon="backup" />} value='release' primaryText="Releases" />
          </DropDownMenu>

          <Icon icon={(this.state.ownerFilter === 'all') ? 'group' : 'person'} style={{ fontSize: '1.25em', color: '#fff', margin: 'auto 0 auto 20px'}} />
          <DropDownMenu
            underlineStyle={{
              margin: 0,
              borderTop: '2px solid rgba(0,0,0,0.15)',
              display: 'none',
            }}
            labelStyle={{
              paddingLeft: 10,
              fontSize: '1em',
              color: '#fff',
              fontWeight: 700,
            }}
            style={{ margin: 'auto 0', height: 'auto' }}
            value={this.state.ownerFilter}
            onChange={this.handleOwnerChange}
            maxHeight={300}
          >
            <MenuItem leftIcon={<Icon icon="group" />} value='all' primaryText="All Owners" />
            {this.state.project_memberships_fetched ? ls(`pp-project-${this.props.params.projectId}-memberships`).map((member) => (
              <MenuItem leftIcon={<Icon icon="person" style={styles.ownerIcon}/>} value={member.person.id} primaryText={member.person.name} style={{ textTransform: 'capitalize', display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', borderTop: '1px solid #eee' }} />
            )) : false}
          </DropDownMenu>
        </div>
        {this.state.project_stories_fetched ? (
          <div style={styles.storiesWrapper}>
            {ls(`pp-project-${this.props.params.projectId}-stories`).filter(this.filterBySearch).filter(this.filterByType).length ? ls(`pp-project-${this.props.params.projectId}-stories`).filter(this.filterBySearch).filter(this.filterByType).sort(sortStoriesByCreatedTime).map((story, storyIndex) => (
              <StoryCard
                key={storyIndex}
                story={story}
                storyIndex={storyIndex}
                setNotification={this.props.setNotification}
              />
            )) : (
              <p style={styles.noStories}>No stories</p>
            )}
          </div>
        ) : (
          <Loader />
        )}
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
    bg: '#8bc34a',
  },
  rejected: {
    text: '#fff',
    bg: 'red',
  },
};
