import React, {PropTypes} from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Nav} from '../components';
import { Snackbar } from 'material-ui';
import {StyleRoot} from 'radium';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import styles from './styles';

class App extends React.Component {

  static propTypes = {
    children: PropTypes.node,
  };

  state = {
    viewTitle: '',
    viewColor: '',
    showBack: false,
    notification: {
      show: false,
      message: '',
      action: '',
      onClick: null,
    },
  };

  setViewTitle = viewTitle => {
    this.setState({ viewTitle });
  }

  setViewColor = viewColor => {
    this.setState({ viewColor });
  }

  setShowBack = showBack => {
    this.setState({ showBack });
  }

  setNotification = (show, message, action, onClick) => {
    if (!show) {
      const notification = this.state.notification;
      notification.show = false;
      return this.setState({
        notification
      });
    } else {
      if (!message) return false;
      const options = {
        show: true,
        message,
      };
      if (action) options.action = action;
      if (onClick) options.onClick = onClick;
      this.setState({ notification: options });
    }
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
      <StyleRoot>
        <div style={styles.base}>
          <Nav
            viewTitle={this.state.viewTitle}
            viewColor={this.state.viewColor}
            showBack={this.state.showBack}
            setViewTitle={this.setViewTitle}
            setViewColor={this.setViewColor}
            setShowBack={this.setShowBack}
            location={this.props.location}
          />
          {React.cloneElement(this.props.children, {
            setViewTitle: this.setViewTitle,
            setViewColor: this.setViewColor,
            viewColor: this.state.viewColor,
            setShowBack: this.setShowBack,
            showBack: this.state.showBack,
            setNotification: this.setNotification,
          })}
          <Snackbar
            open={this.state.notification.show}
            message={this.state.notification.message}
            onActionTouchTap={this.state.notification.onClick}
            action={this.state.notification.action}
            autoHideDuration={4000}
            onRequestClose={() => this.setNotification()}
          />
        </div>
      </StyleRoot>
      </MuiThemeProvider>
    );
  }
}

export default App;
