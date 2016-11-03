import {Icon, Loader} from '../../components';

import ProjectCard from './ProjectCard';
import React from 'react';
import {hashHistory} from 'react-router';
import ls from 'local-storage';
import moment from 'moment';
import radium from 'radium';
import request from 'request';
import styles from './styles';

@radium
export default class ProjectsView extends React.Component {

  static propTypes = {
    setViewTitle: React.PropTypes.func,
    setViewColor: React.PropTypes.func,
    showBack: React.PropTypes.any,
    setShowBack: React.PropTypes.func,
  };

  state = {
    projects_fetched: false,
    projects_activity_fetched: false,
  };

  componentWillMount() {
    this.props.setViewTitle('Projects');
    this.props.setViewColor('#3E7293');
  }

  componentDidMount() {
    const self = this;
    console.log(self);
    self.props.fetchAllActivity();
    (function getActivity(context) {
      console.log(context);
      context.activityTimeout = setTimeout(() => {
        context.props.fetchAllActivity(() => getActivity(context));
      }, 10000);
    }(self));
  }

  componentWillUnmount() {
    window.clearInterval(this.activityTimeout);
  }

  render() {
    return (
      <div style={styles.base}>
        <div style={styles.projectsWrapper}>
          {this.props.projects.length ? this.props.projects.map((project, projectIndex) => {
            const projectColor = `#${ls('pp-me').projects.filter(proj => proj.project_id === project.id)[0].project_color}`;
            return (
              <ProjectCard
                project={project}
                projectIndex={`project-${projectIndex}`}
                styles={styles}
                typeIcons={typeIcons}
                projectColor={projectColor}
                activity={this.props.activity[project.id]}
              />
            );
          }) : (
            <div style={{ display: 'flex', height: '75vh', width: '100%', flexFlow: 'column nowrap', justifyContent: 'center', alignItems: 'center'}}>
              <Loader />
              <span style={{margin: '0px auto', fontSize: '0.8em', color: '#aaa', textTransform: 'uppercase', fontWeight: 700}}>Fetching projects</span>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const typeIcons = {
  all: 'group_work',
  feature: 'layers',
  bug: 'bug_report',
  chore: 'build',
  release: 'backup',
};
