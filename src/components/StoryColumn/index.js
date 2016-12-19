import Icon from '../Icon';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import color from 'color';
import moment from 'moment';
import radium from 'radium';
import StoryCard from '../StoryCard';
import styles from './styles';

function renderStatusColor(state) {
  return Object.assign({}, styles.storyDetail, {
    background: statusColors[state].bg,
    color: statusColors[state].text,
    margin: 'auto 0 auto auto',
    fontWeight: 700,
  });
}

const sortStoriesByCreatedTime = (a, b) => {
  return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
}

class StoryColumn extends React.Component {

  state = {

  }

  componentDidMount() {
    const self = this;
    self.props.fetchProjectStories(self.props.projectId, self.props.state);
    (function getStories(context) {
      context.storyTimeout = setTimeout(() => {
        context.props.fetchProjectStories(context.props.projectId, context.props.state, () => getStories(context));
      }, 10000);
    }(self));
  }

  renderFilteredStories = (search, type, owner, label, specificState, stories) => {
    stories
      .filter(search)
      .filter(owner)
      .filter(type)
      .filter(label)
      .sort(sortStoriesByCreatedTime);
    return stories;
  }

  render() {
    return (
      <div key={`state-column-${this.props.stateIndex}`} style={{
        flex: '0 0 auto',
        width: 350,
        position: 'relative',
        paddingTop: 35,
        boxSizing: 'border-box',
        overflowY: 'hidden',
        display: 'flex',
        flexFlow: 'column nowrap',
        backgroundColor: (this.props.stateIndex % 2 === 0) ? 'transparent' : 'rgba(0,0,0,0.035)',
      }}>
        <div style={{
          color: statusColors[this.props.state].text,
          textTransform: 'uppercase',
          backgroundColor: statusColors[this.props.state].bg,
          padding: '10px 12px',
          // borderBottom: '1px solid rgb(43, 91, 121)',
          flex: '0 0 auto',
          boxSizing: 'border-box',
          borderRadius: 0,
          margin: 0,
          fontWeight: 700,
          fontSize: '0.8em',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
        }}>{this.props.state}</div>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}>
          {this.renderFilteredStories(this.props.filterBySearch, this.props.filterByType, this.props.filterByOwner, this.props.filterByLabels, this.props.state, this.props.stories) ? this.renderFilteredStories(this.props.filterBySearch, this.props.filterByType, this.props.filterByOwner, this.props.filterByLabels, this.props.state, this.props.stories).map((story, storyIndex) => (
            <StoryCard
              projectId={this.props.projectId}
              key={storyIndex}
              story={story}
              state={this.props.state}
              onClick={this.props.toggleStoryDetails}
              storyIndex={storyIndex}
              setNotification={this.props.setNotification}
              handleLabelChange={this.props.handleLabelChange}
              labelFilters={this.props.labelFilters}
              selectStory={this.props.selectStory}
              selectedStory={this.props.selectedStory}
            />
          )) : (
            <p style={styles.noStories}>No stories</p>
          )}
        </div>
      </div>
    );
  }
}

const typeIcons = {
  feature: 'layers',
  bug: 'bug_report',
  chore: 'build',
  release: 'backup',
};

const statuses = [
  'unscheduled',
  'unstarted',
  'started',
  'finished',
  'delivered',
  'rejected',
  'accepted',
];

const statusColors = {
  unscheduled: {
    text: '#fff',
    bg: '#aaa',
  },
  unstarted: {
    text: '#eee',
    bg: '#888',
  },
  started: {
    text: '#fff',
    bg: 'salmon',
  },
  finished: {
    text: '#fff',
    bg: '#3E7293',
  },
  delivered: {
    text: '#fff',
    bg: '#09a3ed',
  },
  accepted: {
    text: '#fff',
    bg: '#8bc34a',
  },
  rejected: {
    text: '#fff',
    bg: 'red',
  },
};

export default radium(StoryColumn);
