import React from 'react';
import styles from './styles';

const Icon = props => (
  <span className="material-icons" style={Object.assign({}, styles.base, props.style)}>{props.icon}</span>
);

export default Icon;
