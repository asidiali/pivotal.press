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
    showStoryDetails: false,
    labelsEl: null,
    selectedStory: {},
  };

  componentDidMount() {
    const CB = new Clipboard('.storyId');

    CB.on('success', (e) => {
        this.props.setNotification(true, `${e.text} copied to clipboard`);
    });

    this.props.fetchProjectStories(this.props.params.projectId);
    this.props.fetchProjectActivity(this.props.params.projectId);
    this.intervalHandle = setInterval(() => {
      this.props.fetchProjectStories(this.props.params.projectId);
      this.props.fetchProjectActivity(this.props.params.projectId);
    }, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalHandle);
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
    const stories = this.props.stories
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

          <StatesFilter
            statesFilter={this.state.stagesFilter}
            handleStatesChange={this.handleStagesChange}
          />

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
          <div style={styles.storiesWrapper}>
            {this.renderFilteredStories(this.filterBySearch, this.filterByType, this.filterByOwner, this.filterByStage, this.filterByLabels) ? this.renderFilteredStories(this.filterBySearch, this.filterByType, this.filterByOwner, this.filterByStage, this.filterByLabels).map((story, storyIndex) => (
              <StoryCard
                projectId={this.props.params.projectId}
                key={storyIndex}
                story={story}
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
        ) : (
          <div style={{ display: 'flex', height: '75vh',width: '100%', flexFlow: 'column nowrap', justifyContent: 'center', alignItems: 'center'}}>
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
        <div style={{
          // backgroundColor: 'rgb(43, 91, 121)',
          backgroundColor: '#444',
          position: 'fixed',
          top: 60,
          right: 0,
          bottom: 0,
          width: '22vw',
          zIndex: 99,
          paddingTop: 60,
          overflowX: 'hidden',
          overflowY: 'hidden',
          display: 'flex',
        }}>
          <h3 style={{
            // backgroundColor: 'rgb(43, 91, 121)',
            backgroundColor: 'rgb(62, 114, 147)',
            textTransform: 'uppercase',
            color: '#ddd',
            fontSize: '0.85em',
            padding: 20,
            margin: 0,
            boxSizing: 'border-box',
            height: 60,
            display: 'flex',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}>
            <Icon icon="history" style={{ margin: 'auto 10px auto 0' }}/>
            Project Activity
          </h3>
          <ul style={{
            listStyle: 'none',
            flex: 1,
            display: 'flex',
            flexFlow: 'column nowrap',
            overflow: 'auto',
            margin: 0,
            padding: '2px 0 5px',
            boxSizing: 'border-box',
          }}>
            {this.props.project_activity && this.props.project_activity.length ? this.props.project_activity.map((activity, activityIndex) => (
              <li
                key={`activity-${activityIndex}`}
                style={{
                  flex: '0 0 auto',
                  color: '#666',
                  backgroundColor: '#fff',
                  borderRadius: 3,
                  padding: '10px 35px 10px 10px',
                  margin: '2px 5px',
                  boxSizing: 'border-box',
                  fontSize: '0.85em',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  height: 60,
                  display: 'flex',
                  flexFlow: 'column nowrap',
                  position: 'relative',
                }}
              >
                <Icon icon="keyboard_arrow_right" style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1.25em',
                  color: '#aaa',
                }} />

                <div style={{
                  display: 'flex',
                  flexFlow: 'row nowrap',
                }}>
                  <span style={{
                    padding: 0,
                    margin: 'auto 2px',
                    boxSizing: 'border-box',
                    color: '#ccc',
                    fontWeight: 700,
                    fontSize: '0.9em',
                  }}>{moment(activity.occurred_at).fromNow()}</span>
                  <Icon icon={typeIcons[activity.primary_resources[0].story_type]} style={{
                    margin: '0 0 4px auto',
                    fontSize: '1.25em',
                    color: '#aaa',
                    position: 'relative',
                    top: -2
                  }} />
                </div>
                <div style={{
                  display: 'flex',
                  flexFlow: 'row nowrap',
                }}>
                  <span style={{
                    padding: 0,
                    margin: 'auto 2px',
                    boxSizing: 'border-box',
                  }}>{activity.performed_by.name}</span>
                  <span style={{
                    flex: 1,
                    margin: 'auto 2px',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}>{activity.highlight}</span>
                  <span style={{
                    backgroundColor: '#eee',
                    margin: '0 auto auto 4px',
                    padding: '3px 5px',
                    boxSizing: 'border-box',
                    flex: '0 0 auto',
                    fontFamily: 'Source Code pro',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.9em',
                  }}>
                    <Icon icon="launch" style={{ marginRight: 5, fontSize: '1em' }} />
                    {activity.primary_resources[0].id}
                  </span>
                </div>

              </li>
            )) : false}
          </ul>
        </div>
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
