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

const StoryColumn = props => (
  <div>
    column
  </div>
);

StoryColumn.propTypes = {
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

export default radium(StoryColumn);
