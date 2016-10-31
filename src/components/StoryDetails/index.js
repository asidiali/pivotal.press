import React from 'react';

const StoryDetails = (props) => (
  <span>{(props.story) ? props.story.id : false}</span>
);

export default StoryDetails;
