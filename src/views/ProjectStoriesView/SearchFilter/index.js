import {Icon} from '../../../components';
import React from 'react';
import radium from 'radium';

const SearchFilter = props => (
  <div style={props.styles.searchInputWrapper}>
    <Icon icon="search" style={props.styles.searchIcon} />
    <input
      placeholder="search stories"
      style={props.styles.searchInput}
      onKeyUp={props.onKeyUp}
    />
  </div>
);

export default radium(SearchFilter);
