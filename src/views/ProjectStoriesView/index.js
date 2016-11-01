import {
  DropDownMenu,
  Menu,
  MenuItem,
  Popover,
} from 'material-ui';
import {
  Icon,
  Loader,
  StoryCard,
  StoryDetails,
} from '../../components';

import Clipboard from 'clipboard';
import LabelsFilter from './LabelsFilter';
import OwnersFilter from './OwnersFilter';
import React from 'react';
import SearchFilter from './SearchFilter';
import StatesFilter from './StatesFilter';
import TypesFilter from './TypesFilter';
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
    stagesFilter: 'all',
    labelFilters: [],
    showLabelsPopover: false,
    labelsEl: null,
    selectedStory: {},
  };

  componentDidMount() {
    const CB = new Clipboard('.storyId');

    CB.on('success', (e) => {
        this.props.setNotification(true, `${e.text} copied to clipboard`);
    });

    this.fetchProjectData();
  }

  fetchProjectData() {
    if (ls('pp-api') && ls('pp-me')) {
      const projectId = this.props.params.projectId;

      const projectColor = `#${ls('pp-me').projects.filter(proj => proj.project_id === parseInt(projectId))[0].project_color}`;
      this.props.setViewColor(projectColor);

      const headers = new Headers();
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
        this.props.setViewCount(res.length);
      });

      fetch(`https://www.pivotaltracker.com/services/v5/projects/${projectId}/memberships`, {
        mode: 'cors',
        headers,
        method: 'GET',
      }).then(res => res.json()).then((res) => {
        ls.set(`pp-project-${projectId}-memberships`, res);
        this.setState({project_memberships_fetched: true});
      });

      fetch(`https://www.pivotaltracker.com/services/v5/projects/${projectId}/labels`, {
        mode: 'cors',
        headers,
        method: 'GET',
      }).then(res => res.json()).then((res) => {
        ls.set(`pp-project-${projectId}-labels`, res);
        this.setState({project_labels_fetched: true});
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }


  filterBySearch = story => {
    const reg = new RegExp(this.state.searchFilter, 'i', 'g');
    return story.name.match(reg) || story.id.toString().match(reg);
  }

  filterByType = story => {
    if (this.state.storyTypeFilter === 'all') return true;
    return story.story_type === this.state.storyTypeFilter;
  }

  filterByOwner = story => {
    if (this.state.ownerFilter === 'all') return true;
    return story.owned_by_id === this.state.ownerFilter;
  }

  filterByStage = story => {
    if (this.state.stagesFilter === 'all') return true;
    return story.current_state === this.state.stagesFilter;
  }

  filterByLabels = story => {
    let res = false;

    if (!this.state.labelFilters.length) return true;

    if (!story.labels.length) return false;

    for (let i = 0; i < story.labels.length; i++) {
      if (this.state.labelFilters.includes(story.labels[i].id)) res = true;
    }

    return res;
  }

  toggleLabelsPopover = (el) => {
    if (el) {
      this.setState({
        showLabelsPopover: true,
        labelsEl: el,
      });
    } else {
      this.setState({
        showLabelsPopover: false,
        labelsEl: null,
      });
    }
  }

  handleStoryTypeChange = (e, t, val) => this.setState({ storyTypeFilter: val });

  handleOwnerChange = (e, t, val) => this.setState({ ownerFilter: val });

  handleStagesChange = (e, t, val) => this.setState({ stagesFilter: val });

  handleLabelChange = (val) => {
    let labels = this.state.labelFilters;

    if (!val) {
      labels = [];
    } else {
      if (labels.includes(val)) {
        labels.splice(labels.indexOf(val), 1);
      } else {
        labels.push(val);
      }
    }
    console.log(labels);

    this.setState({ labelFilters: labels });
    this.toggleLabelsPopover();
  }

  renderFilteredStories = (search, type, owner, stage, label) => {
    const stories = ls(`pp-project-${this.props.params.projectId}-stories`)
      .filter(search)
      .filter(owner)
      .filter(type)
      .filter(stage)
      .filter(label)
      .sort(sortStoriesByCreatedTime);
    return stories;
  }

  selectStory = story => {
    console.log('selectiing story ' + story.id);
    this.setState({ selectedStory: story });
  }

  render() {
    console.log(this.props.params.projectId);
    return (
      <div style={styles.base}>
        <div style={styles.filtersWrapper}>

          <SearchFilter
            styles={styles}
            onKeyUp={(e) => {
              this.setState({ searchFilter: e.currentTarget.value });
            }}
          />

          <TypesFilter
            storyTypeFilter={this.state.storyTypeFilter}
            handleStoryTypeChange={this.handleStoryTypeChange}
          />

          <LabelsFilter
            toggleLabelsPopover={this.toggleLabelsPopover}
            labelFilters={this.state.labelFilters}
            project_labels_fetched={this.state.project_labels_fetched}
            handleLabelChange={this.handleLabelChange}
            showLabelsPopover={this.state.showLabelsPopover}
            labelsEl={this.state.labelsEl}
            params={this.props.params}
          />

          <OwnersFilter
            ownerFilter={this.state.ownerFilter}
            handleOwnerChange={this.handleOwnerChange}
            project_memberships_fetched={this.state.project_memberships_fetched}
            projectId={this.props.params.projectId}
            styles={styles}
          />

          <StatesFilter
            statesFilter={this.state.stagesFilter}
            handleStatesChange={this.handleStagesChange}
          />

          <span style={{
            margin: 'auto 10px auto auto',
            cursor: 'pointer',
          }} data-tip="Refresh Stories" onClick={() => {
              this.setState({
                project_stories_fetched: false,
                project_memberships_fetched: false,
                project_labels_fetched: false,
              });
              this.fetchProjectData();
          }}>
            <Icon icon="refresh" style={{ color: '#ccc', fontSize: '1.5em'}} />
          </span>
        </div>

        {this.state.project_stories_fetched ? (
          <div style={styles.storiesWrapper}>
            {this.renderFilteredStories(this.filterBySearch, this.filterByType, this.filterByOwner, this.filterByStage, this.filterByLabels) ? this.renderFilteredStories(this.filterBySearch, this.filterByType, this.filterByOwner, this.filterByStage, this.filterByLabels).map((story, storyIndex) => (
              <StoryCard
                projectId={this.props.params.projectId}
                key={storyIndex}
                story={story}
                storyIndex={storyIndex}
                setNotification={this.props.setNotification}
                handleLabelChange={this.handleLabelChange}
                labelFilters={this.state.labelFilters}
                selectStory={this.selectStory}
                selectedStory={this.state.selectedStory}
              />
            )) : (
              <p style={styles.noStories}>No stories</p>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', height: '75vh',width: '100%', flexFlow: 'column nowrap', justifyContent: 'center', alignItems: 'center'}}>
            <Loader />
            <span style={{margin: '0px auto', fontSize: '0.8em', color: '#aaa', textTransform: 'uppercase', fontWeight: 700}}>Fetching stories</span>
          </div>
        )}
        <div style={Object.assign({}, styles.activeCardBackground, { display: this.state.selectedStory.id ? 'block' : 'none'})}> </div>
        <StoryDetails

        />
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
