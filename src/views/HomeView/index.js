import {Icon} from '../../components';
import React from 'react';
import {hashHistory} from 'react-router';
import ls from 'local-storage';
import radium from 'radium';
import styles from './styles';

@radium
export default class HomeView extends React.Component {

  componentDidMount() {
    if (ls('pp-api') && ls('pp-me')) {
      hashHistory.push('/projects');
    } else {
      console.log('needs auth');
    }
  }

  render() {
    return (
      <div style={styles.base}>
        <h2 style={styles.pp}>
          <Icon icon="dashboard" style={{ margin: 'auto 10px auto auto'}} />
          Pivotal.Press
        </h2>
        <h5 style={{ color: '#fff', fontWeight: 400, margin: '0 auto 20px', fontSize: '1.1em'}}>An open-source PivotalTracker client for managing stories.</h5>
        <p style={{color: '#ddd', textAlign: 'center', fontWeight: 400, fontSize: '0.9em' margin: '0 10px'}}>Login with a valid PivotalTracker API Key:</p>
        <form style={styles.form} onSubmit={(e) => {
          e.preventDefault();
          const headers = new Headers();
          ls.set('pp-api', e.target.api_key.value);
          headers.append('X-TrackerToken', ls('pp-api'));
          // TODO paginate requests
          fetch(`https://www.pivotaltracker.com/services/v5/me`, {
            mode: 'cors',
            headers,
            method: 'GET',
          }).then(res => res.json()).then((res) => {
            ls.set(`pp-me`, res);
            hashHistory.push('/projects');
          });
        }}>
          <input
            style={styles.input}
            placeholder="your key"
            type="text"
            name="api_key"
          />
          <button style={styles.submitBtn} type="submit">Login <Icon icon="lock" style={{margin: 'auto 0 auto 5px'}}/></button>
        </form>
        <span style={styles.copy}>&copy; 2016 Adam Sidiali.</span>
      </div>
    );
  }
}
