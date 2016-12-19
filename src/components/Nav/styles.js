export default {
  base: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 999,
    backgroundColor: '#fff',
    display: 'flex',
    flexFlow: 'row nowrap',
    '@media (max-width: 1200px)': {
      right: '28vw',
    },
  },
  brand: {
    fontWeight: 700,
    margin: 'auto 10px auto 20px',
    fontSize: '0.9em',
    letterSpacing: 1,
    textTransform: 'uppercase',
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    flex: '0 0 auto',
    color: 'rgb(62, 114, 147)',
    '@media (max-width: 768px)': {
      fontSize: '1.15em',
    },
  },
  brandText: {
    '@media (max-width: 768px)': {
      display: 'none',
    }
  },
  loggedInUser: {
    margin: 'auto 20px auto auto',
    fontSize: '0.9em',
    color: 'rgb(62, 114, 147)',
    fontWeight: 400,
    display: 'flex',
    flex: '0 0 auto',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      fontSize: '1.15em',
    }
  },
  loggedInUserText: {
    '@media (max-width: 768px)': {
      display: 'none',
    }
  },
  viewTitle: {
    // position: 'absolute',
    // top: '50%',
    // left: '50%',
    // transform: 'translate(-50%,-50%)',
    margin: 'auto 10px',
    fontWeight: 700,
    fontSize: '1em',
    flex: '0 0 auto',
    padding: '10px 0',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    color: '#000',
    // textTransform: 'uppercase',
    '@media (max-width: 768px)': {
      margin: 'auto 10px auto 0',
      flex: 1,
    },
  },
};
