import React from 'react';

const Layout = props => (
  <div style={{
    position: 'absolute',
    top: 60,
    bottom: 0,
    left: 0,
    right: 0,
    width: '100vw',
    overflowX: 'hidden',
    overflowY: 'hidden',
    display: 'flex',
  }}>
    {React.cloneElement(props.children, {
      fetchProjects: props.fetchProjects,
      activity: props.activity,
      projects: props.projects,
      setNotification: props.setNotification,
      setShowBack: props.setShowBack,
      setViewColor: props.setViewColor,
      setViewCount: props.setViewCount,
      setViewTitle: props.setViewTitle,
      showBack: props.showBack,
      viewColor: props.viewColor,
      fetchAllActivity: props.fetchAllActivity,
      fetchProjectStories: props.fetchProjectStories,
      fetchProjectActivity: props.fetchProjectActivity,
      stories: props.stories,
      project_labels: props.project_labels,
      project_memberships: props.project_memberships,
      project_activity: props.project_activity,
      clearProjectData: props.clearProjectData,
    })}
  </div>
);

export default Layout;
