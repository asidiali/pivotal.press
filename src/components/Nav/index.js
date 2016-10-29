import Icon from '../Icon';
import React from 'react';
import ls from 'local-storage';
import styles from './styles';

const Nav = props => (
  <nav style={styles.base}>
    <span style={styles.brand}>
      <Icon icon="dashboard" style={{marginRight: 10}} />
      Pivotal.Press
    </span>
    <span style={styles.viewTitle}>
      {props.viewTitle}
    </span>
    <span style={styles.loggedInUser}>
      {ls('pp-me').name || ''}
      <Icon icon="account_circle" style={{marginLeft: 10}} />
    </span>
  </nav>
);

export default Nav;
