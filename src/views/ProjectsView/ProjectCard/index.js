import { Icon } from '../../../components';
import React from 'react';
import { hashHistory } from 'react-router';
import ls from 'local-storage';
import moment from 'moment';
import radium from 'radium';

const ProjectCard = props => (
  <div key={`project-${props.projectIndex}`} style={Object.assign({}, props.styles.projectCard, {
    borderLeft: `10px solid ${props.projectColor || 'rgb(62, 114, 147)'}`,
  })} onClick={() => {
    ls.set(`pp-project-${props.project.id}-details`, props.project);
    hashHistory.push(`/projects/${props.project.id}`);
  }}>
    <span key="projectNameSpan" style={props.styles.projectName}><Icon icon="assignment" style={{color: '#444', margin: 'auto 10px auto 0'}} /> {props.project.name}</span>
    <ul key="projectActivityList" style={props.styles.projectActivityList}>
      {props.activity && props.activity.length ? props.activity.map((activity, activityIndex) => (
        <li key={`activity-${activityIndex}`} style={props.styles.projectActivityListItem}>
          <span style={props.styles.activityOccured}>{moment(activity.occurred_at).fromNow()}</span>
          <span><Icon style={{ color: '#aaa', margin: 'auto 5px auto 0' }}icon={(activity.primary_resources[0].kind === 'story') ? props.typeIcons[activity.primary_resources[0].story_type] : 'assignment'} /></span>
          <span style={{whiteSpace: 'nowrap', flex: 1, textOverflow: 'ellipsis'}}>{activity.message}</span>
        </li>
      )) : false}
    </ul>
  </div>
);

export default radium(ProjectCard);
