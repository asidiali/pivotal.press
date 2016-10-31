import {
  DropDownMenu,
  Menu,
  MenuItem,
  Popover,
} from 'material-ui';
import {
  Icon,
  Loader,
  StoryCard,
  StoryDetails,
} from '../../components';

import Clipboard from 'clipboard';
import React from 'react';
import {hashHistory} from 'react-router';
import ls from 'local-storage';
import moment from 'moment';
import radium from 'radium';
import request from 'request';
import styles from './styles';

function sortStoriesByCreatedTime(a, b) {
  return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
}

@radium
export default class ProjectStoriesView extends React.Component {

  state = {
    project_stories_fetched: false,
    project_memberships_fetched: false,
    searchFilter: '',
    storyTypeFilter: 'all',
    ownerFilter: 'all',
    stagesFilter: 'all',
    labelFilters: [],
    showLabelsPopover: false,
    labelsEl: null,
    selectedStory: {},
  };

  componentDidMount() {
    const CB = new Clipboard('.storyId');

    CB.on('success', (e) => {
        this.props.setNotification(true, `${e.text} copied to clipboard`);
    });


    if (ls('pp-api') && ls('pp-me')) {
      const projectId = this.props.params.projectId;

      const projectColor = `#${ls('pp-me').projects.filter(proj => proj.project_id === parseInt(projectId))[0].project_color}`;
      this.props.setViewColor(projectColor);

      const headers = new Headers();
      headers.append('X-TrackerToken', ls('pp-api'));
      this.props.setViewTitle(ls(`pp-project-${projectId}-details`).name);
      this.props.setShowBack({
        link: '/projects',
        text: 'Projects',
        clearOnClick: true,
      });
      // TODO paginate requests
      fetch(`https://www.pivotaltracker.com/services/v5/projects/${projectId}/stories?limit=1000`, {
        mode: 'cors',
        headers,
        method: 'GET',
      }).then(res => res.json()).then((res) => {
        ls.set(`pp-project-${projectId}-stories`, res);
        this.setState({project_stories_fetched: true});
      });

      fetch(`https://www.pivotaltracker.com/services/v5/projects/${projectId}/memberships`, {
        mode: 'cors',
        headers,
        method: 'GET',
      }).then(res => res.json()).then((res) => {
        ls.set(`pp-project-${projectId}-memberships`, res);
        this.setState({project_memberships_fetched: true});
      });

      fetch(`https://www.pivotaltracker.com/services/v5/projects/${projectId}/labels`, {
        mode: 'cors',
        headers,
        method: 'GET',
      }).then(res => res.json()).then((res) => {
        ls.set(`pp-project-${projectId}-labels`, res);
        this.setState({project_labels_fetched: true});
      });
    }
  }

  sortActiveLabels = (a, b) => {
    const sortA = this.state.labelFilters.includes(a.id) ? -1 : 1;
    const sortB = this.state.labelFilters.includes(b.id) ? -1 : 1;
    return sortA - sortB;
  }

  sortOwners = (a, b) => {
    return (a.person.name <= b.person.name) ? -1 : 1;
  }


  filterBySearch = story => {
    const reg = new RegExp(this.state.searchFilter, 'i', 'g');
    return story.name.match(reg);
  }

  filterByType = story => {
    if (this.state.storyTypeFilter === 'all') return true;
    return story.story_type === this.state.storyTypeFilter;
  }

  filterByOwner = story => {
    if (this.state.ownerFilter === 'all') return true;
    return story.owned_by_id === this.state.ownerFilter;
  }

  filterByStage = story => {
    if (this.state.stagesFilter === 'all') return true;
    return story.current_state === this.state.stagesFilter;
  }

  filterByLabels = story => {
    let res = false;

    if (!this.state.labelFilters.length) return true;

    if (!story.labels.length) return false;

    for (let i = 0; i < story.labels.length; i++) {
      if (this.state.labelFilters.includes(story.labels[i].id)) res = true;
    }

    return res;
  }

  toggleLabelsPopover = (el) => {
    if (el) {
      this.setState({
        showLabelsPopover: true,
        labelsEl: el,
      });
    } else {
      this.setState({
        showLabelsPopover: false,
        labelsEl: null,
      });
    }
  }

  handleStoryTypeChange = (e, t, val) => this.setState({ storyTypeFilter: val });

  handleOwnerChange = (e, t, val) => this.setState({ ownerFilter: val });

  handleStagesChange = (e, t, val) => this.setState({ stagesFilter: val });

  handleLabelChange = (val) => {
    let labels = this.state.labelFilters;

    if (!val) {
      labels = [];
    } else {
      if (labels.includes(val)) {
        labels.splice(labels.indexOf(val), 1);
      } else {
        labels.push(val);
      }
    }
    console.log(labels);

    this.setState({ labelFilters: labels });
    this.toggleLabelsPopover();
  }

  renderFilteredStories = (search, type, owner, stage, label) => {
    return ls(`pp-project-${this.props.params.projectId}-stories`)
      .filter(search)
      .filter(owner)
      .filter(type)
      .filter(stage)
      .filter(label)
      .sort(sortStoriesByCreatedTime)
  }

  selectStory = story => {
    console.log('selectiing story ' + story.id);
    this.setState({ selectedStory: story });
  }

  render() {
    console.log(this.props.params.projectId);
    return (
      <div style={styles.base}>
        <div style={styles.filtersWrapper}>
          <div style={styles.searchInputWrapper}>
            <Icon icon="search" style={styles.searchIcon} />
            <input
              placeholder="search stories"
              style={styles.searchInput}
              onKeyUp={(e) => {
                this.setState({ searchFilter: e.currentTarget.value });
              }}
            />
          </div>
          <Icon icon={typeIcons[this.state.storyTypeFilter]} style={{ fontSize: '1.25em', color: '#fff', margin: 'auto 0 auto 20px', flex: '0 0 auto'}} />
          <DropDownMenu
            underlineStyle={{
              margin: 0,
              borderTop: '2px solid rgba(0,0,0,0.15)',
              display: 'none',
            }}
            labelStyle={{
              paddingLeft: 10,
              fontSize: '1em',
              color: '#fff',
              fontWeight: 400,
            }}
            style={{ margin: 'auto 0', height: 'auto', flex: '0 0 auto' }}
            value={this.state.storyTypeFilter}
            onChange={this.handleStoryTypeChange}
          >
            <MenuItem leftIcon={<Icon icon="group_work" style={{ fontSize: '1.2em', color: '#aaa' }} />} value='all' primaryText="All Types" style={{ textTransform: 'capitalize', alignItems: 'center', borderTop: '0px solid #eee' }}  />
            <MenuItem leftIcon={<Icon icon="bug_report" style={{ fontSize: '1.2em', color: '#aaa' }} />} value='bug' primaryText="Bugs" style={{ textTransform: 'capitalize', alignItems: 'center', borderTop: '1px solid #eee' }}  />
            <MenuItem leftIcon={<Icon icon="build" style={{ fontSize: '1.2em', color: '#aaa' }} />} value='chore' primaryText="Chores" style={{ textTransform: 'capitalize', alignItems: 'center', borderTop: '1px solid #eee' }}  />
            <MenuItem leftIcon={<Icon icon="extension" />} value='feature' primaryText="Features" style={{ textTransform: 'capitalize', alignItems: 'center', borderTop: '1px solid #eee' }}  />
            <MenuItem leftIcon={<Icon icon="backup" style={{ fontSize: '1.2em', color: '#aaa' }} />} value='release' primaryText="Releases" style={{ textTransform: 'capitalize', alignItems: 'center', borderTop: '1px solid #eee' }}  />
          </DropDownMenu>


          <div style={{
            flex: '0 0 auto',
            color: '#fff',
            fontWeight: 400,
            display: 'flex',
            alignItems: 'center',
            margin: 'auto 10px',
          }} onClick={(e) => this.toggleLabelsPopover(e.currentTarget)}>
            <Icon icon={this.state.labelFilters.length ? 'label_outline' : 'label'} style={{ margin: 'auto 10px auto 0'}} />
            {this.state.labelFilters.length ? (
              <span>{this.state.labelFilters.length} label{(this.state.labelFilters.length === 1) ? false : 's'}</span>
            ) : (
              <span>All Labels</span>
            )}
            <Icon icon="arrow_drop_down" style={{ fontSize: '1.5em', margin: 'auto 0 auto 10px'}} />
          </div>
          <Popover
            open={this.state.showLabelsPopover}
            anchorEl={this.state.labelsEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={() => this.toggleLabelsPopover()}
          >
            <Menu maxHeight={350} style={{ width: 200, overflowX: 'hidden', textOverflow: 'ellpsis', whiteSpace: 'nowrap'}}>
              <MenuItem leftIcon={<Icon icon="label" />} onClick={() => this.handleLabelChange()} primaryText="All Labels" />
              {this.state.project_labels_fetched ? ls(`pp-project-${this.props.params.projectId}-labels`).sort(this.sortActiveLabels).map((label, labelIndex) => (
                <MenuItem key={`label-${labelIndex}`}onClick={() => this.handleLabelChange(label.id)} leftIcon={<Icon icon="label_outline" style={{color: '#aaa' }} />} value={label.id} primaryText={label.name} style={{ borderTop: '1px solid #eee', flex: 1, fontSize: '0.9em', padding: 0, backgroundColor: (this.state.labelFilters.includes(label.id) ? '#AED6F1' : '#fff') }} />
              )) : false}
            </Menu>
          </Popover>

          <Icon icon={(this.state.ownerFilter === 'all') ? 'group' : 'person'} style={{flex: '0 0 auto', fontSize: '1.25em', color: '#fff', margin: 'auto 0 auto 20px'}} />
          <DropDownMenu
            underlineStyle={{
              margin: 0,
              borderTop: '2px solid rgba(0,0,0,0.15)',
              display: 'none',
            }}
            labelStyle={{
              paddingLeft: 10,
              fontSize: '1em',
              color: '#fff',
              fontWeight: 400,
            }}
            style={{ margin: 'auto 0', height: 'auto', flex: '0 0 auto', }}
            value={this.state.ownerFilter}
            onChange={this.handleOwnerChange}
            maxHeight={300}
          >
            <MenuItem leftIcon={<Icon icon="group" />} value='all' primaryText="All Owners" />
            <MenuItem leftIcon={<Icon icon="person" />} value={ls('pp-me').id} primaryText="Me" />
            {this.state.project_memberships_fetched ? ls(`pp-project-${this.props.params.projectId}-memberships`).filter((val) => val.person.id !== ls('pp-me').id).sort(this.sortOwners).map((member, memberIndex) => (
              <MenuItem key={`member-${memberIndex}`} leftIcon={<Icon icon="person" style={styles.ownerIcon}/>} value={member.person.id} primaryText={member.person.name} style={{ textTransform: 'capitalize', borderTop: '1px solid #eee' }} />
            )) : false}
          </DropDownMenu>

          <DropDownMenu
            underlineStyle={{
              margin: 0,
              borderTop: '2px solid rgba(0,0,0,0.15)',
              display: 'none',
            }}
            labelStyle={{
              paddingLeft: 10,
              fontSize: '1em',
              color: '#fff',
              fontWeight: 400,
              textTransform: 'capitalize',
            }}
            style={{ margin: 'auto 0', height: 'auto', flex: '0 0 auto' }}
            value={this.state.stagesFilter}
            onChange={this.handleStagesChange}
            maxHeight={350}
          >
            <MenuItem value='all' primaryText="All States" />
            {statuses.map((status, statusIndex) => (
              <MenuItem key={`status-${statusIndex}`} value={status} primaryText={`${statusIndex} - ${status}`} style={{ textTransform: 'capitalize', alignItems: 'center', borderTop: '1px solid #eee' }} />
            ))}
          </DropDownMenu>

        </div>

        {this.state.project_stories_fetched ? (
          <div style={styles.storiesWrapper}>
            {this.renderFilteredStories(this.filterBySearch, this.filterByType, this.filterByOwner, this.filterByStage, this.filterByLabels) ? this.renderFilteredStories(this.filterBySearch, this.filterByType, this.filterByOwner, this.filterByStage, this.filterByLabels).map((story, storyIndex) => (
              <StoryCard
                key={storyIndex}
                story={story}
                storyIndex={storyIndex}
                setNotification={this.props.setNotification}
                handleLabelChange={this.handleLabelChange}
                labelFilters={this.state.labelFilters}
                selectStory={this.selectStory}
                selectedStory={this.state.selectedStory}
              />
            )) : (
              <p style={styles.noStories}>No stories</p>
            )}
          </div>
        ) : (
          <Loader />
        )}
        <div style={Object.assign({}, styles.activeCardBackground, { display: this.state.selectedStory.id ? 'block' : 'none'})}> </div>
        <StoryDetails

        />
      </div>
    );
  }
}

const typeIcons = {
  all: 'group_work',
  feature: 'extension',
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
    text: '#888',
    bg: '#eee',
  },
  unstarted: {
    text: '#eee',
    bg: '#888',
  },
  started: {
    text: '#fff',
    bg: '#444',
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
