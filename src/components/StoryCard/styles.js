export default {
  storyCard: {
    backgroundColor: '#fff',
    height: 'auto',
    maxHeight: 280,
    textDecoration: 'none',
    borderRadius: 3,
    flex: '0 0 auto',
    margin: 5,
    display: 'flex',
    flexFlow: 'column nowrap',
    padding: 10,
    boxSizing: 'border-box',
    border: 0,
    cursor: 'pointer',
  },
  activeStoryCard: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: '60vw',
    height: '75vh',
    background: '#fff',
    zIndex: 999999,
    transition: '100ms ease-out',
  },
  labelsWrapper: {
    margin: '10px -5px',
    display: 'flex',
    flexFlow: 'row wrap',
    flex: 1,
  },
  labelItem: {
    color: '#aaa',
    fontSize: '0.8em',
    textDecoration: 'underline',
    margin: '0 5px',
    flex: '0 0 auto',
    ':hover': {
      color: '#09a3ed',
    }
  },
  lastUpdated: {
    color: '#aaa',
    fontSize: '0.8em',
    margin: '5px 0 0',
    fontWeight: 700,
    flex: '0 0 auto',
  },
  storyDetails: {
    listStyle: 'none',
    display: 'flex',
    flex: '0 0 auto',
    flexFlow: 'row wrap',
    justifyContent: 'flex-start',
    margin: '0 0 10px 0',
    padding: 0,
  },
  storyDetail: {
    flex: '0 0 auto',
    color: '#444',
    background: '#fff',
    padding: '3px 6px',
    boxSizing: 'border-box',
    borderRadius: 3,
    fontSize: '0.75em',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0,
    margin: 'auto 5px auto 0',
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyName: {
    fontSize: '1em',
    fontWeight: 400,
    color: '#444',
    resize: 'none',
    lineHeight: '1.5',
    border: 0,
    maxHeight: 140,
    position: 'relative',
    overflowX: 'hidden',
    overflowY: 'hidden',
    boxSizing: 'border-box',
    outline: 'none',
  },
};
