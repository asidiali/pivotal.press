import Icon from '../Icon';
import React from 'react';
import moment from 'moment';
import radium from 'radium';
import styles from './styles';

function renderStatusColor(state) {
  return Object.assign({}, styles.storyDetail, {
    background: statusColors[state].bg,
    color: statusColors[state].text,
    margin: 'auto 0 auto auto',
  });
}

const StoryCard = props => (
  <div key={props.storyIndex} style={styles.storyCard}>
    <ul style={styles.storyDetails}>
      <li style={Object.assign({}, styles.storyDetail, {
        fontFamily: 'Source Code pro',
      })}>
        <Icon icon="content_copy" style={{ marginRight: 5 }} />
        {props.story.id}
      </li>
      <li style={styles.storyDetail}>
        <Icon icon={typeIcons[props.story.story_type]} style={{ marginRight: 5 }} />
        {props.story.story_type}
      </li>
      <li style={renderStatusColor(props.story.current_state)}>
        {statuses.indexOf(props.story.current_state)} - {props.story.current_state}
      </li>
    </ul>
    <p style={styles.storyName}>
      {props.story.name}
      <span style={styles.storyGradient} />
    </p>
    {props.story.labels.length ? (
      <div style={styles.labelsWrapper}>
        {props.story.labels.map((label, labelIndex) => (
          <span key={`${props.storyIndex}-${labelIndex}`} style={styles.labelItem}>{label.name}</span>
        ))}
      </div>
    ) : false}
    <span style={styles.lastUpdated}>Last updated {moment(props.story.updated_at).fromNow()}</span>
  </div>
);

StoryCard.propTypes = {
  story: React.PropTypes.object,
};

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

export default radium(StoryCard);
