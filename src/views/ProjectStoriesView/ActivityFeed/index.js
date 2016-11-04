import {
  Icon,
} from '../../../components';
import React from 'react';
import moment from 'moment';
import radium from 'radium';

const styles = {
  bg: {
    backgroundColor: '#333',
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: '22vw',
    zIndex: 9999,
    boxShadow: '-5px 15px 15px rgba(0,0,0,0.15)',
    paddingTop: 55,
    overflowX: 'hidden',
    overflowY: 'hidden',
    display: 'flex',
    '@media (max-width: 1200px)': {
      width: '28vw',
    },
  },
  title: {
    // backgroundColor: 'rgb(43, 91, 121)',
    backgroundColor: '#333',
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
  },
  list: {
    listStyle: 'none',
    flex: 1,
    display: 'flex',
    flexFlow: 'column nowrap',
    overflow: 'auto',
    margin: 0,
    padding: '0 0 5px',
    boxSizing: 'border-box',
  },
  listItem: {
    flex: '0 0 auto',
    color: '#666',
    backgroundColor: '#fff',
    borderRadius: 3,
    padding: '10px 35px 10px 10px',
    margin: '3px 10px',
    boxSizing: 'border-box',
    fontSize: '0.85em',
    fontWeight: 700,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    height: 60,
    display: 'flex',
    flexFlow: 'column nowrap',
    position: 'relative',
  },
  listItemArrow: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1.25em',
    color: '#aaa',
  },
  activityTime: {
    padding: 0,
    margin: 'auto 2px',
    boxSizing: 'border-box',
    color: '#ccc',
    fontWeight: 700,
    fontSize: '0.9em',
  },
  activityIcon: {
    margin: '0 0 4px auto',
    fontSize: '1.25em',
    color: '#aaa',
    position: 'relative',
    top: -2
  },
  activityName: {
    padding: 0,
    margin: 'auto 2px',
    boxSizing: 'border-box',
    flex: '0 0 auto',
    '@media (max-width: 1300px)': {
      display: 'none',
    },
  },
  activityInitials: {
    padding: 0,
    margin: 'auto 2px',
    boxSizing: 'border-box',
    display: 'none',
    flex: '0 0 auto',
    '@media (max-width: 1300px)': {
      display: 'block',
    },
  },
  activityHighlight: {
    flex: 1,
    margin: 'auto 2px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  idIcon: {
    backgroundColor: '#eee',
    margin: '0 auto auto 4px',
    padding: '3px 5px',
    boxSizing: 'border-box',
    flex: '0 0 auto',
    fontFamily: 'Source Code pro',
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.9em',
  },
};

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
