import {
  Icon,
} from '../../../components';
import React from 'react';
import moment from 'moment';
import radium from 'radium';
import styles from './styles';

const ActivityFeed = props => (
  <div style={styles.bg}>
    <h3 style={styles.title}>
      <Icon icon="history" style={{ margin: 'auto 10px auto 0' }}/>
      Activity Feed
    </h3>
    <ul style={styles.list}>
      {props.project_activity && props.project_activity.length ? props.project_activity.map((activity, activityIndex) => (
        <li
          key={`activity-${activityIndex}`}
          style={styles.listItem}
        >
          <Icon icon="keyboard_arrow_right" style={styles.listItemArrow} />

          <div style={{
            display: 'flex',
            flexFlow: 'row nowrap',
          }}>
            <span style={styles.activityTime}>{moment(activity.occurred_at).fromNow()}</span>
            <Icon icon={(activity.primary_resources[0].kind === 'story') ? typeIcons[activity.primary_resources[0].story_type] : otherIcons[activity.primary_resources[0].kind]} style={styles.activityIcon} />
          </div>
          <div style={{
            display: 'flex',
            flexFlow: 'row nowrap',
          }}>
            <span style={styles.activityName}>{activity.performed_by.name}</span>
            <span style={styles.activityInitials}>{activity.performed_by.initials}</span>
            <span style={styles.activityHighlight}>{activity.highlight}</span>
            <span style={Object.assign({}, styles.idIcon, {
              backgroundColor: activity.primary_resources[0].current_state ? statusColors[activity.primary_resources[0].current_state].bg : '#eee',
              color: activity.primary_resources[0].current_state ? statusColors[activity.primary_resources[0].current_state].text : '#444',
            })}>
              <Icon icon="launch" style={{ marginRight: 5, fontSize: '1em' }} />
              {activity.primary_resources[0].id}
            </span>
          </div>

        </li>
      )) : false}
    </ul>
  </div>
);

const typeIcons = {
  all: 'group_work',
  feature: 'layers',
  bug: 'bug_report',
  chore: 'build',
  release: 'backup',
};

const otherIcons ={
  project: 'assignment',
  label: 'label outline',
};

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

export default radium(ActivityFeed);
