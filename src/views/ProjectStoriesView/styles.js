export default {
  base: {},
  storiesWrapper: {
    display: 'flex',
    flexFlow: 'row wrap',
    padding: '0.5%',
  },
  storyCard: {
    backgroundColor: '#fff',
    width: '24%',
    height: 250,
    flex: '0 0 auto',
    margin: '0.5%',
    display: 'flex',
    flexFlow: 'column nowrap',
    padding: 20,
    boxSizing: 'border-box',
    borderTop: '0px solid #ddd',
    borderRight: '1px solid #ddd',
    borderLeft: '1px solid #ddd',
    borderBottom: '2px solid #ddd',
  },
  lastUpdated: {
    color: '#ccc',
    fontSize: '0.8em',
    margin: 'auto 0 5px',
    fontWeight: 700,
  },
  storyDetails: {
    listStyle: 'none',
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    margin: '0 0 20px 0',
    padding: 0,
  },
  storyDetail: {
    flex: '0 0 auto',
    color: '#555',
    background: '#eee',
    padding: '3px 6px',
    boxSizing: 'border-box',
    borderRadius: 3,
    fontSize: '0.8em',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 1,
    margin: 'auto 0'
  },
  storyName: {
    fontSize: '1.1em',
    fontWeight: 300,
    color: '#222',
  }
};
