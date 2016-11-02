import { Icon } from '../../../components';
import React from 'react';
import { hashHistory } from 'react-router';
import ls from 'local-storage';
import moment from 'moment';
import radium from 'radium';

const ProjectCard = props => (
  <div key={props.projectIndex} style={Object.assign({}, props.styles.projectCard, {
    borderLeft: `10px solid ${props.projectColor || 'rgb(62, 114, 147)'}`,
  })} onClick={() => {
    ls.set(`pp-project-${props.project.id}-details`, props.project);
    hashHistory.push(`/projects/${props.project.id}`);
  }}>
    <span style={props.styles.projectName}><Icon icon="assignment" style={{color: '#444', margin: 'auto 10px auto 0'}} /> {props.project.name}</span>
    <ul style={props.styles.projectActivityList}>
      <li style={{color: '#aaa', fontSize: '0.8em', margin: '0 0 5px', textTransform: 'uppercase', fontWeight: 700}}>Recent Activity</li>
      {props.activity && props.activity.length ? props.activity.map((activity, activityIndex) => (
        <li style={props.styles.projectActivityListItem} key={`activity-${activityIndex}`}>
          <span style={props.styles.activityOccured}>{moment(activity.occurred_at).fromNow()}</span>
          <span><Icon style={{ color: '#ccc', margin: 'auto 5px auto 0' }}icon={(activity.primary_resources[0].kind === 'story') ? props.typeIcons[activity.primary_resources[0].story_type] : 'assignment'} /></span>
          <span style={{whiteSpace: 'nowrap', flex: 1, textOverflow: 'ellipsis'}}>{activity.message}</span>
        </li>
      )) : false}
    </ul>
  </div>
);

export default radium(ProjectCard);
