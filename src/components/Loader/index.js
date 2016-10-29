import React from 'react';
import styles from './styles';

const Loader = props => (
  <div style={styles.base}>
    <div className="sk-rotating-plane"></div>
  </div>
);

export default Loader;
