import {
  DropDownMenu,
  MenuItem,
} from 'material-ui';

import {
  Icon,
} from '../../../components';
import React from 'react';
import radium from 'radium';

const TypesFilter = props => (
  <div style={{
    flex: '0 0 auto',
    display: 'flex',
    alignItems: 'center',
  }}>
    <Icon icon={typeIcons[props.storyTypeFilter]} style={{ fontSize: '1.25em', color: '#888', margin: 'auto 0 auto 20px', flex: '0 0 auto'}} />
    <DropDownMenu
      underlineStyle={{
        margin: 0,
        borderTop: '2px solid rgba(0,0,0,0.15)',
        display: 'none',
      }}
      labelStyle={{
        paddingLeft: 10,
        fontSize: '0.9em',
        color: '#888',
        fontWeight: 700,
      }}
      style={{ margin: 'auto 0', height: 'auto', flex: '0 0 auto' }}
      value={props.storyTypeFilter}
      onChange={props.handleStoryTypeChange}
    >
      <MenuItem leftIcon={<Icon icon="group_work" style={{ fontSize: '1.2em', color: '#aaa' }} />} value='all' primaryText="All Types" style={{ textTransform: 'capitalize', alignItems: 'center', borderTop: '0px solid #eee' }}  />
      <MenuItem leftIcon={<Icon icon="bug_report" style={{ fontSize: '1.2em', color: '#aaa' }} />} value='bug' primaryText="Bugs" style={{ textTransform: 'capitalize', alignItems: 'center', borderTop: '1px solid #eee' }}  />
      <MenuItem leftIcon={<Icon icon="build" style={{ fontSize: '1.2em', color: '#aaa' }} />} value='chore' primaryText="Chores" style={{ textTransform: 'capitalize', alignItems: 'center', borderTop: '1px solid #eee' }}  />
      <MenuItem leftIcon={<Icon icon="layers" />} value='feature' primaryText="Features" style={{ textTransform: 'capitalize', alignItems: 'center', borderTop: '1px solid #eee' }}  />
      <MenuItem leftIcon={<Icon icon="backup" style={{ fontSize: '1.2em', color: '#aaa' }} />} value='release' primaryText="Releases" style={{ textTransform: 'capitalize', alignItems: 'center', borderTop: '1px solid #eee' }}  />
    </DropDownMenu>
  </div>
);

const typeIcons = {
  all: 'group_work',
  feature: 'layers',
  bug: 'bug_report',
  chore: 'build',
  release: 'backup',
};

export default radium(TypesFilter);
