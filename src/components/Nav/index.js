import {
  Menu,
  MenuItem,
  Popover,
} from 'material-ui';

import Icon from '../Icon';
import React from 'react';
import {hashHistory} from 'react-router';
import {injectProps} from 'relpers';
import ls from 'local-storage';
import radium from 'radium';
import styles from './styles';

class Nav extends React.Component {

  state = {
    showAccountPopover: false,
    accountPopoverEl: null,
  };

  toggleCloseAccountPopover = el => this.setState({
    showAccountPopover: !!el,
    accountPopoverEl: el || null,
  });

  @injectProps
  render({
    showBack,
    viewTitle,
    location,
  }) {
    return (
      <nav style={styles.base}>
        <span style={styles.brand}>
          <Icon icon="dashboard" style={{marginRight: 10}} />
          <span style={Object.assign({}, styles.brandText, {
            '@media (max-width: 768px)': {
              display: (location.pathname === '/') ? 'block' : 'none',
            }
          })}>Pivotal.Press</span>
        </span>
        <span style={styles.viewTitle}>
          {showBack ? (
            <span
              style={{ textDecoration: 'underline', cursor: 'pointer', marginRight: 10}}
              onClick={() => {
                hashHistory.push(showBack.link);
              }}
            >
              {showBack.text}
            </span>
          ) : false}
          {showBack ? (
            <span>&gt; &nbsp;</span>
          ) : false}
          {viewTitle}
        </span>
        {ls('pp-me') ? (
          <div style={styles.loggedInUser} onClick={(e) => {this.toggleCloseAccountPopover(e.currentTarget)}}>
            <span style={styles.loggedInUserText}>{ls('pp-me').name || ''}</span>
            <Icon icon="account_circle" style={{marginLeft: 10}} />
          </div>
        ) : false}

        <Popover
          open={this.state.showAccountPopover}
          anchorEl={this.state.accountPopoverEl}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          onRequestClose={() => this.toggleCloseAccountPopover()}
        >
          <Menu>
            <MenuItem leftIcon={<Icon icon="exit_to_app" style={{fontSize: '1.5em', color: '#aaa', boxSizing: 'border-box'}} />} primaryText="Exit App" onClick={() => {
              ls.set('pp-me', false);
              ls.set('pp-api', false);
              this.toggleCloseAccountPopover();
              setTimeout(() => {
                hashHistory.push('/');
              }, 1000);
            }} />
          </Menu>
        </Popover>

      </nav>
    );
  }
}

export default radium(Nav);
