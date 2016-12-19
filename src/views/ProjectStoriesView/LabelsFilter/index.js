import {
  Menu,
  MenuItem,
  Popover,
} from 'material-ui';

import {
  Icon,
} from '../../../components';
import React from 'react';
import ls from 'local-storage';

const styles = {
  labelsPopoverWrapper: {
    flex: '0 0 auto',
    color: '#888',
    fontWeight: 700,
    fontSize: '0.9em',
    display: 'flex',
    alignItems: 'center',
    margin: 'auto 10px',
  },
};

const LabelsFilter = (props) => {

  function sortActiveLabels(a, b) {
    const sortA = props.labelFilters.includes(a.id) ? -1 : 1;
    const sortB = props.labelFilters.includes(b.id) ? -1 : 1;
    return sortA - sortB;
  }

  return (
    <div style={styles.labelsPopoverWrapper} onClick={(e) => props.toggleLabelsPopover(e.currentTarget)}>
      <Icon icon={props.labelFilters.length ? 'label_outline' : 'label'} style={{ margin: 'auto 10px auto 0'}} />
      {props.labelFilters.length ? (
        <span>{props.labelFilters.length} label{(props.labelFilters.length === 1) ? false : 's'}</span>
      ) : (
        <span>All Labels</span>
      )}
      <Icon icon="arrow_drop_down" style={{ fontSize: '1.5em', margin: 'auto 0 auto 10px'}} />
      <Popover
        open={props.showLabelsPopover}
        anchorEl={props.labelsEl}
        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
        onRequestClose={() => props.toggleLabelsPopover()}
      >
        <Menu maxHeight={350} style={{ width: 200, overflowX: 'hidden', textOverflow: 'ellpsis', whiteSpace: 'nowrap'}}>
          <MenuItem leftIcon={<Icon icon="label" />} onClick={() => props.handleLabelChange()} primaryText="All Labels" />
          {props.labels && props.labels.length ? props.labels.sort(sortActiveLabels).map((label, labelIndex) => (
            <MenuItem key={`label-${labelIndex}`}onClick={() => props.handleLabelChange(label.id)} leftIcon={<Icon icon="label_outline" style={{color: '#aaa' }} />} value={label.id} primaryText={label.name} style={{ borderTop: '1px solid #eee', flex: 1, fontSize: '0.9em', padding: 0, backgroundColor: (props.labelFilters.includes(label.id) ? '#AED6F1' : '#fff') }} />
          )) : false}
        </Menu>
      </Popover>
    </div>
  );
}

LabelsFilter.propTypes = {
  toggleLabelsPopover: React.PropTypes.func,
  labelFilters: React.PropTypes.array,
  project_labels_fetched: React.PropTypes.bool,
  handleLabelChange: React.PropTypes.func,
  sortActiveLabels: React.PropTypes.func,
  showLabelsPopover: React.PropTypes.bool,
  labelsEl: React.PropTypes.node,
  params: React.PropTypes.object,
};

export default LabelsFilter;
