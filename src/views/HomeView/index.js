import React from 'react';
import {hashHistory} from 'react-router';
import ls from 'local-storage';
import styles from './styles';

export default class HomeView extends React.Component {

  componentDidMount() {
    if (ls('pp-api').length) {
      hashHistory.push('/projects');
    } else {
      console.log('needs auth');
    }
  }

  render() {
    return (
      <div style={styles.base}>
        <h1>Pivotal.Press</h1>
        <p>API Key</p>
        <form onSubmit={(e) => {
          e.preventDefault();
          ls.set('pp-api', e.target.api_key.value);
          hashHistory.push('/projects');
        }}>
          <input
            placeholder="2b68344f1906a491fb65876f58aa78a7"
            type="text"
            name="api_key"
          />
        </form>
        <p>logged in as: {ls('pp-api')}</p>
      </div>
    );
  }
}
