export default {
  base: { paddingTop: 60, flex: '0 0 auto', width: '78vw', background: 'rgb(43, 91, 121)', '@media (max-width: 1200px)': {
    width: '72vw',
  }},
  storiesWrapper: {
    display: 'flex',
    flexFlow: 'column nowrap',
    padding: '0 0 10px 0',
    boxSizing: 'border-box',
  },
  filtersWrapper: {
    position: 'fixed',
    borderRight: '1px solid rgba(0,0,0,0.15)',
    top: 60,
    height: 60,
    width: '78vw',
    left: 0,
    right: '22vw',
    backgroundColor: 'rgb(43, 91, 121)',
    margin: 'auto 0',
    padding: '0 10px',
    boxSizing: 'border-box',
    zIndex: 99,
    display: 'flex',
    flexFlow: 'row nowrap',
    overflowY: 'hidden',
    overflowX: 'auto',
    '@media (max-width: 1200px)': {
      width: '72vw',
    },
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
  activeCardBackground: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 99999,
  },
};
