import React from 'react';
import styles from './styles';

const StoryDetails = (props) => (
  <div onClick={() => props.toggleStoryDetails()} style={Object.assign({}, styles.bg, { opacity: props.show ? 1 : 0, pointerEvents: props.show ? 'auto' : 'none' })}>
    <div style={Object.assign({}, styles.panel, { opacity: props.show ? 1 : 0, pointerEvents: props.show ? 'auto' : 'none', transform: props.show ? 'translateX(-100%)' : 'translateX(0)'})}>
      <span>{(props.story) ? props.story.id : false}</span>
    </div>
  </div>
);

export default StoryDetails;
