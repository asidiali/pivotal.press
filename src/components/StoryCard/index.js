import Icon from '../Icon';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import color from 'color';
import moment from 'moment';
import radium from 'radium';
import styles from './styles';

function renderStatusColor(state) {
  return Object.assign({}, styles.storyDetail, {
    background: statusColors[state].bg,
    color: statusColors[state].text,
    margin: 'auto 0 auto auto',
    fontWeight: 700,
  });
}

const StoryCard = props => (
  <a href={`https://pivotaltracker.com/n/projects/${props.projectId}/stories/${props.story.id}`} target="_blank" key={props.storyIndex} style={styles.storyCard}>
    <ul style={styles.storyDetails}>
      <li
        data-tip="Click to copy to clipboard"
        className="storyId"
        style={Object.assign({}, styles.storyDetail, {
          fontFamily: 'Source Code pro',
          background: statusColors[props.state].bg,
          color: statusColors[props.state].text,
        })}
        data-clipboard-text={props.story.id}
      >
        <Icon icon="content_copy" style={{ marginRight: 5 }} />
        {props.story.id}
      </li>
      <li style={Object.assign({}, styles.storyDetail, {
        border: `1px solid ${statusColors[props.state].bg}`,
        color: statusColors[props.state].bg,
        background: 'transparent',
      })}>
        <Icon icon={typeIcons[props.story.story_type]} style={{ marginRight: 5 }} />
        {props.story.story_type}
      </li>
      {props.story.estimate ? (
        <li style={renderStatusColor(props.story.current_state)}>
          {props.story.estimate}
        </li>
      ) : false}
    </ul>
    <p style={styles.storyName}>
      {props.story.name}
    </p>
    <div style={styles.labelsWrapper}>
      {props.story.labels.length ? props.story.labels.map((label, labelIndex) => (
        <span data-tip={props.labelFilters.includes(label.id) ? `Remove "${label.name}" from filter` : `Add "${label.name}" to filter`} key={`${props.storyIndex}-${labelIndex}`} style={styles.labelItem} onClick={() => props.handleLabelChange(label.id)}>{label.name}</span>
      )) : false}
    </div>
    <span style={styles.lastUpdated}>Last updated {moment(props.story.updated_at).fromNow()}</span>
    <ReactTooltip effect="solid" place="top" />
  </a>
);

StoryCard.propTypes = {
  story: React.PropTypes.object,
  storyIndex: React.PropTypes.number,
  selectedStory: React.PropTypes.object,

};

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

export default radium(StoryCard);
