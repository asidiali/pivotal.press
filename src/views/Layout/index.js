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
      activity: props.activity,
      clearProjectData: props.clearProjectData,
      fetchAllActivity: props.fetchAllActivity,
      fetchProjectActivity: props.fetchProjectActivity,
      fetchProjectLabels: props.fetchProjectLabels,
      fetchProjectMemberships: props.fetchProjectMemberships,
      fetchProjects: props.fetchProjects,
      fetchProjectStories: props.fetchProjectStories,
      stories_loaded: props.stories_loaded,
      markStoriesAsLoaded: props.markStoriesAsLoaded,
      me: props.me,
      project_activity: props.project_activity,
      project_labels: props.project_labels,
      project_memberships: props.project_memberships,
      projects: props.projects,
      setNotification: props.setNotification,
      setShowBack: props.setShowBack,
      setViewColor: props.setViewColor,
      setViewCount: props.setViewCount,
      setViewTitle: props.setViewTitle,
      showBack: props.showBack,
      unstarted_stories: props.unstarted_stories,
      unscheduled_stories: props.unscheduled_stories,
      started_stories: props.started_stories,
      finished_stories: props.finished_stories,
      delivered_stories: props.delivered_stories,
      rejected_stories: props.rejected_stories,
      accepted_stories: props.accepted_stories,
      viewColor: props.viewColor,
    })}
  </div>
);

export default Layout;
