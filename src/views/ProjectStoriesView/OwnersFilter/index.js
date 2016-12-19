import {
  DropDownMenu,
  MenuItem,
} from 'material-ui';

import {
  Icon,
} from '../../../components';
import React from 'react';
import ls from 'local-storage';

function sortOwners(a,b) {
  return (a.person.name <= b.person.name) ? -1 : 1;
};

const OwnersFilter = props => (
  <div style={{
    flex: '0 0 auto',
    margin: 'auto 0',
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
  }}>
    <Icon icon={(props.ownerFilter === 'all') ? 'group' : 'person'} style={{flex: '0 0 auto', fontSize: '1.25em', color: '#888', margin: 'auto 0 auto 20px'}} />
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
      style={{ margin: 'auto 0', height: 50, flex: '0 0 auto', }}
      value={props.ownerFilter}
      onChange={props.handleOwnerChange}
      maxHeight={300}
    >
      <MenuItem leftIcon={<Icon icon="group" />} value='all' primaryText="All Owners" />
      <MenuItem leftIcon={<Icon icon="person" />} value={ls('pp-me').id} primaryText="Me" />
      {props.members && props.members.length ? props.members.filter((val) => val.person.id !== ls('pp-me').id).sort(sortOwners).map((member, memberIndex) => (
        <MenuItem key={`member-${memberIndex}`} leftIcon={<Icon icon="person" style={props.styles.ownerIcon}/>} value={member.person.id} primaryText={member.person.name} style={{ textTransform: 'capitalize', borderTop: '1px solid #eee' }} />
      )) : false}
    </DropDownMenu>
  </div>
);

OwnersFilter.propTypes = {
  ownerFilter: React.PropTypes.string,
  handleOwnerChange: React.PropTypes.func,
  project_memberships_fetched: React.PropTypes.bool,
  projectId: React.PropTypes.string,
  sortOwners: React.PropTypes.func,
};

export default OwnersFilter;
