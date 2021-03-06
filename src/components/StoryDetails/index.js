import Icon from '../Icon';
import Loader from '../Loader';
import React from 'react';
import ReactTooltip from 'react-tooltip';
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

const StoryDetails = (props) => (
  <div onClick={() => props.toggleStoryDetails()} style={Object.assign({}, styles.bg, { opacity: props.show ? 1 : 0, pointerEvents: props.show ? 'auto' : 'none' })}>
    <div onClick={(e) => e.stopPropagation()} style={Object.assign({}, styles.panel, { opacity: props.show ? 1 : 0, pointerEvents: props.show ? 'auto' : 'none', transform: props.show ? 'translateX(-100%)' : 'translateX(0)'})}>
      {(props.story && props.story.id) ? (
        <div style={styles.storyCard}>
          <ul style={styles.storyDetails}>
            <li
              data-tip="Click to copy to clipboard"
              className="storyId"
              style={Object.assign({}, styles.storyDetail, {
                fontFamily: 'Source Code pro',
              })}
              data-clipboard-text={props.story.id}
            >
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
          </p>
          <div style={styles.labelsWrapper}>
            {props.story.labels.length ? props.story.labels.map((label, labelIndex) => (
              <span data-tip={props.labelFilters.includes(label.id) ? `Remove "${label.name}" from filter` : `Add "${label.name}" to filter`} key={`${props.storyIndex}-${labelIndex}`} style={styles.labelItem} onClick={() => props.handleLabelChange(label.id)}>{label.name}</span>
            )) : false}
          </div>
          <span style={styles.lastUpdated}>Last updated {moment(props.story.updated_at).fromNow()}</span>
          <ReactTooltip effect="solid" place="bottom" />
        </div>
      ) : (
        <Loader />
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

export default radium(StoryDetails);
