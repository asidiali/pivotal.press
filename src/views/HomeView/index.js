import {Icon} from '../../components';
import React from 'react';
import {hashHistory} from 'react-router';
import ls from 'local-storage';
import styles from './styles';

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
        <p style={{color: '#fff', fontWeight: 700,}}>Login with your PivotalTracker API Key</p>
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
            placeholder="your API key"
            type="text"
            name="api_key"
          />
          <button style={styles.submitBtn} type="submit">Login &gt;</button>
        </form>
      </div>
    );
  }
}
