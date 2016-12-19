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

    CB.on('success', (e) => {
        self.props.setNotification(true, `${e.text} copied to clipboard`);
    });

    self.props.fetchProjectStories(self.props.params.projectId);
    self.props.fetchProjectActivity(self.props.params.projectId);

    (function getStories(context) {
      context.storyTimeout = setTimeout(() => {
        context.props.fetchProjectStories(context.props.params.projectId, () => getStories(context));
      }, 10000);
    }(self));

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
    const stories = this.props.stories
      .filter(search)
      .filter(owner)
      .filter(type)
      .filter((story) => {
        return story.current_state === specificState;
      })
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

          {/*}<StatesFilter
            statesFilter={this.state.stagesFilter}
            handleStatesChange={this.handleStagesChange}
          />{*/}

          {/*}<span style={{
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
          </span>{*/}
        </div>

        {this.props.stories && this.props.stories.length ? (
          <div style={styles.storiesColumnsWrapper}>
            {statuses.map((state, stateIndex) => (
              <div key={`state-column-${stateIndex}`} style={{
                flex: '0 0 auto',
                width: 350,
                position: 'relative',
                paddingTop: 35,
                boxSizing: 'border-box',
                overflowY: 'hidden',
                display: 'flex',
                flexFlow: 'column nowrap',
                backgroundColor: (stateIndex % 2 === 0) ? 'transparent' : 'rgba(0,0,0,0.035)',
              }}>
                <div style={{
                  color: statusColors[state].text,
                  textTransform: 'uppercase',
                  backgroundColor: statusColors[state].bg,
                  padding: '10px 12px',
                  // borderBottom: '1px solid rgb(43, 91, 121)',
                  flex: '0 0 auto',
                  boxSizing: 'border-box',
                  borderRadius: 0,
                  margin: 0,
                  fontWeight: 700,
                  fontSize: '0.8em',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                }}>{state}</div>
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                }}>
                  {this.renderFilteredStories(this.filterBySearch, this.filterByType, this.filterByOwner, this.filterByState, this.filterByLabels, state) ? this.renderFilteredStories(this.filterBySearch, this.filterByType, this.filterByOwner, this.filterByState, this.filterByLabels, state).map((story, storyIndex) => (
                    <StoryCard
                      projectId={this.props.params.projectId}
                      key={storyIndex}
                      story={story}
                      state={state}
                      onClick={this.toggleStoryDetails}
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
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', height: '75vh', width: '100%', flexFlow: 'column nowrap', justifyContent: 'center', alignItems: 'center'}}>
            <Loader />
            <span style={{margin: '0px auto', fontSize: '0.8em', color: '#aaa', textTransform: 'uppercase', fontWeight: 700}}>Fetching stories</span>
          </div>
        )}
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
