import React, {PropTypes} from 'react';

import {Nav} from '../components';
import {StyleRoot} from 'radium';
import styles from './styles';

class App extends React.Component {

  static propTypes = {
    children: PropTypes.node,
  };

  state = {
    viewTitle: '',
    showBack: false,
  };

  setViewTitle = viewTitle => {
    console.log(viewTitle);
    this.setState({ viewTitle });
  }

  setShowBack = showBack => {
    console.log(showBack);
    this.setState({ showBack });
  }

  render() {
    return (
      <StyleRoot>
        <div style={styles.base}>
          <Nav viewTitle={this.state.viewTitle} showBack={this.state.showBack} />
          {React.cloneElement(this.props.children, {
            setViewTitle: this.setViewTitle,
            setShowBack: this.setShowBack,
            showBack: this.state.showBack,
          })}
        </div>
      </StyleRoot>
    );
  }
}

export default App;
