import Icon from '../Icon';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import color from 'color';
import moment from 'moment';
import radium from 'radium';
import StoryCard from '../StoryCard';
import styles from './styles';

function renderStatusColor(state) {
  return Object.assign({}, styles.storyDetail, {
    background: statusColors[state].bg,
    color: statusColors[state].text,
    margin: 'auto 0 auto auto',
    fontWeight: 700,
  });
}

const renderFilteredStories = (search, type, owner, label, specificState, stories) => {
  console.log(stories);
  stories
    .filter(search)
    .filter(owner)
    .filter(type)
    .filter(label)
    .sort(sortStoriesByCreatedTime);
  return stories;
}

const sortStoriesByCreatedTime = (a, b) => {
  return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
}

const StoryColumn = props => (
  <div key={`state-column-${props.stateIndex}`} style={{
    flex: '0 0 auto',
    width: 350,
    position: 'relative',
    paddingTop: 35,
    boxSizing: 'border-box',
    overflowY: 'hidden',
    display: 'flex',
    flexFlow: 'column nowrap',
    backgroundColor: (props.stateIndex % 2 === 0) ? 'transparent' : 'rgba(0,0,0,0.035)',
  }}>
    <div style={{
      color: statusColors[props.state].text,
      textTransform: 'uppercase',
      backgroundColor: statusColors[props.state].bg,
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
    }}>{props.state}</div>
    <div style={{
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      {renderFilteredStories(props.filterBySearch, props.filterByType, props.filterByOwner, props.filterByLabels, props.state, props.stories) ? renderFilteredStories(props.filterBySearch, props.filterByType, props.filterByOwner, props.filterByLabels, props.state, props.stories).map((story, storyIndex) => (
        <StoryCard
          projectId={props.projectId}
          key={storyIndex}
          story={story}
          state={props.state}
          onClick={props.toggleStoryDetails}
          storyIndex={storyIndex}
          setNotification={props.setNotification}
          handleLabelChange={props.handleLabelChange}
          labelFilters={props.labelFilters}
          selectStory={props.selectStory}
          selectedStory={props.selectedStory}
        />
      )) : (
        <p style={styles.noStories}>No stories</p>
      )}
    </div>
  </div>
);

const typeIcons = {
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

export default radium(StoryColumn);
