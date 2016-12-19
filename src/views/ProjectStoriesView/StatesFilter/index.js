import {
  DropDownMenu,
  MenuItem,
} from 'material-ui';

import React from 'react';
import radium from 'radium';

const StatesFilter = props => (
  <DropDownMenu
    underlineStyle={{
      margin: 0,
      borderTop: '2px solid rgba(0,0,0,0.15)',
      display: 'none',
    }}
    labelStyle={{
      paddingLeft: 10,
      fontSize: '1em',
      color: '#888',
      fontWeight: 400,
      textTransform: 'capitalize',
    }}
    style={{ margin: 'auto 0', height: 'auto', flex: '0 0 auto' }}
    value={props.statesFilter}
    onChange={props.handleStatesChange}
    maxHeight={350}
  >
    <MenuItem value='all' primaryText="All States" />
    {statuses.map((status, statusIndex) => (
      <MenuItem key={`status-${statusIndex}`} value={status} primaryText={`${statusIndex} - ${status}`} style={{ textTransform: 'capitalize', alignItems: 'center', borderTop: '1px solid #eee' }} />
    ))}
  </DropDownMenu>
);

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

export default radium(StatesFilter);
