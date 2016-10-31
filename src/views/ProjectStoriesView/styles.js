export default {
  base: { paddingTop: 60, flex: 1 },
  storiesWrapper: {
    display: 'flex',
    flexFlow: 'row wrap',
    padding: '0.5%',
  },
  filtersWrapper: {
    position: 'fixed',
    top: 60,
    height: 60,
    width: '100vw',
    left: 0,
    right: 0,
    backgroundColor: 'rgb(62, 114, 147)',
    margin: 'auto 0',
    padding: '0 10px',
    boxSizing: 'border-box',
    zIndex: 99,
    display: 'flex',
    flexFlow: 'row nowrap',
    borderTop: '1px solid rgba(0,0,0,0.1)',
    overflowY: 'hidden',
    overflowX: 'auto',
  },
  searchInputWrapper: {
    position: 'relative',
    flex: '0 0 auto',
    margin: 'auto 10px auto 0',
  },
  searchInput: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    color: '#fff',
    padding: '10px 10px 10px 40px',
    boxSizing: 'border-box',
    borderRadius: 3,
    fontSize: '0.9em',
    border: 0,
    margin: 'auto',
    outline: 'none',
  },
  searchIcon: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    left: 10,
    color: '#fff',
  },
  noStories: {
    margin: '40px auto auto',
    textAlign: 'center',
    color: '#aaa',
    fontSize: '1.1em',
  },
  ownerIcon: {
    fontSize: '1.25em',
    margin: 0,
    padding: '5px 0',
    color: '#aaa'
  },
};
