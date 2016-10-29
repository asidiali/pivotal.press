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
  };

  setViewTitle = viewTitle => {
    console.log(viewTitle);
    this.setState({ viewTitle });
  }

  render() {
    return (
      <StyleRoot>
        <div style={styles.base}>
          <Nav viewTitle={this.state.viewTitle} />
          {React.cloneElement(this.props.children, {
            setViewTitle: this.setViewTitle,
          })}
        </div>
      </StyleRoot>
    );
  }
}

export default App;
