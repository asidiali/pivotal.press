import Icon from '../Icon';
import React from 'react';
import {hashHistory} from 'react-router';
import ls from 'local-storage';
import radium from 'radium';
import styles from './styles';

const Nav = props => (
  <nav style={styles.base}>
    <span style={styles.brand}>
      <Icon icon="dashboard" style={{marginRight: 10}} />
      <span style={styles.brandText}>Pivotal.Press</span>
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
    {ls('pp-me') ? (
      <span style={styles.loggedInUser}>
        {ls('pp-me').name || ''}
        <Icon icon="account_circle" style={{marginLeft: 10}} />
      </span>
    ) : false}
  </nav>
);

export default radium(Nav);
