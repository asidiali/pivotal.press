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
    overflowY: 'auto',
  }}>
    {React.cloneElement(props.children, {
      setViewTitle: props.setViewTitle,
      setShowBack: props.setShowBack,
      showBack: props.showBack,
    })}
  </div>
);

export default Layout;
