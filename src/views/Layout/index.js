import React from 'react';

const Layout = props => (
  <div style={{
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: '100vw',
    height: '100vh',
    overflowX: 'hidden',
    overflowY: 'auto',
  }}>
    {props.children}
  </div>
);

export default Layout;
