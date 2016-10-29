import Icon from '../Icon';
import React from 'react';
import {hashHistory} from 'react-router';
import ls from 'local-storage';
import styles from './styles';

const Nav = props => (
  <nav style={styles.base}>
    <span style={styles.brand}>
      <Icon icon="dashboard" style={{marginRight: 10}} />
      Pivotal.Press
    </span>
    <span style={styles.viewTitle}>
      {props.showBack ? (
        <span
          style={{ textDecoration: 'underline', cursor: 'pointer', marginRight: 10}}
          onClick={() => {
            hashHistory.push(props.showBack.link);
          }}
        >
          {props.showBack.text}
        </span>
      ) : false}
      {props.showBack ? (
        <span>&gt; &nbsp;</span>
      ) : false}
      {props.viewTitle}
    </span>
    <span style={styles.loggedInUser}>
      {ls('pp-me').name || ''}
      <Icon icon="account_circle" style={{marginLeft: 10}} />
    </span>
  </nav>
);

export default Nav;
