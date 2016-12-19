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
  StoryColumn,
  StoryDetails,
} from '../../components';

import ActivityFeed from './ActivityFeed';
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
    showStoryDetails: false,
    labelsEl: null,
    selectedStory: {},
  };

  componentDidMount() {
    const self = this;
    const CB = new Clipboard('.storyId');
    console.log(self.props);
    CB.on('success', (e) => {
        self.props.setNotification(true, `${e.text} copied to clipboard`);
    });

    self.props.fetchProjectActivity(self.props.params.projectId);
    self.props.fetchProjectMemberships(self.props.params.projectId);
    self.props.fetchProjectLabels(self.props.params.projectId);

    (function getActivity(context) {
      context.activityTimeout = setTimeout(() => {
        context.props.fetchProjectActivity(context.props.params.projectId, () => getActivity(context));
      }, 10000);
    }(self));
  }

  componentWillUnmount() {
    clearInterval(this.storyTimeout);
    clearInterval(this.activityTimeout);
    this.props.clearProjectData();

    if (this.props.showBack && this.props.showBack.clearOnClick) this.props.setShowBack(false);
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
  filterByState = (story) => {
    return story.current_state === state;
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

    this.setState({ labelFilters: labels });
    this.toggleLabelsPopover();
  }

  renderFilteredStories = (search, type, owner, state, label, specificState) => {
    const stories = this.props[`${specificState}_stories`]
      .filter(search)
      .filter(owner)
      .filter(type)
      .filter(label)
      .sort(sortStoriesByCreatedTime);
    return stories;
  }

  selectStory = story => {
    console.log('selectiing story ' + story.id);
    this.setState({ selectedStory: story });
  }

  toggleStoryDetails = (story) => {
    if (story) {
      return this.setState({
        showStoryDetails: true,
        selectedStory: story,
      });
    }
    return this.setState({
      showStoryDetails: false,
      selectedStory: {},
    });
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
            labels={this.props.project_labels}
            toggleLabelsPopover={this.toggleLabelsPopover}
            labelFilters={this.state.labelFilters}
            project_labels_fetched={this.state.project_labels_fetched}
            handleLabelChange={this.handleLabelChange}
            showLabelsPopover={this.state.showLabelsPopover}
            labelsEl={this.state.labelsEl}
            params={this.props.params}
          />

          <OwnersFilter
            members={this.props.project_memberships}
            ownerFilter={this.state.ownerFilter}
            handleOwnerChange={this.handleOwnerChange}
            project_memberships_fetched={this.state.project_memberships_fetched}
            projectId={this.props.params.projectId}
            styles={styles}
          />

        </div>

        <div style={styles.storiesColumnsWrapper}>
          {statuses.map((state, stateIndex) => (
            <StoryColumn
              state={state}
              fetchProjectStories={this.props.fetchProjectStories}
              stateIndex={stateIndex}
              projectId={this.props.params.projectId}
              labelFilters={this.state.labelFilters}
              selectStory={this.selectStory}
              selectedStory={this.state.selectedStory}
              filterBySearch={this.filterBySearch}
              filterByType={this.filterByType}
              filterByOwner={this.filterByOwner}
              filterByLabels={this.filterByLabels}
              stories={this.props[`${state}_stories`]}
              toggleStoryDetails={this.toggleStoryDetails}
              setNotification={this.props.setNotification}
              handleLabelChange={this.handleLabelChange}
            />
          ))}
        </div>

        <div style={Object.assign({}, styles.activeCardBackground, { display: this.state.selectedStory.id ? 'block' : 'none'})}> </div>
        <StoryDetails
          show={this.state.showStoryDetails}
          toggleStoryDetails={this.toggleStoryDetails}
          story={this.state.selectedStory}
          setNotification={this.props.setNotification}
          handleLabelChange={this.handleLabelChange}
          labelFilters={this.state.labelFilters}
        />

        <ActivityFeed
          project_activity={this.props.project_activity}
        />

      </div>
    );
  }
}

const typeIcons = {
  all: 'group_work',
  feature: 'layers',
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
    text: '#fff',
    bg: '#aaa',
  },
  unstarted: {
    text: '#eee',
    bg: '#888',
  },
  started: {
    text: '#fff',
    bg: 'salmon',
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
