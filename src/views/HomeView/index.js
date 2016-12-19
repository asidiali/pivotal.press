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
        <h5 style={{ color: '#fff', fontWeight: 400, textAlign: 'center', margin: '0 10px 20px', fontSize: '1.1em'}}>A PivotalTracker client for managing stories.</h5>
        <p style={{color: '#ddd', textAlign: 'center', fontWeight: 400, fontSize: '0.9em', margin: '0 10px'}}>Login with a valid PivotalTracker API Key:</p>
        <form style={styles.form} onSubmit={(e) => {
          e.preventDefault();
          this.props.fetchMe(e.target.api_key.value, () => {
            hashHistory.push('/projects');
          })
        }}>
          <input
            style={styles.input}
            placeholder="your key"
            type="text"
            name="api_key"
          />
          <button style={styles.submitBtn} type="submit">Login <Icon icon="lock" style={{margin: 'auto 0 auto 5px'}}/></button>
        </form>
        <a href="https://github.com/asidiali/pivotal.press/" target="_blank">
          <img src="https://dl.dropboxusercontent.com/s/paoe8eo4hswcaya/GitHub-Mark-Light-120px-plus.png" style={{ margin: '20px auto auto', width: 30, height: 30}} />
        </a>
        <span style={styles.copy}>&copy; 2016 Adam Sidiali.</span>
      </div>
    );
  }
}
