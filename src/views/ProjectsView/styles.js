export default {
  base: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  viewTitle: {},
  projectsWrapper: {
    display: 'flex',
    flexFlow: 'row wrap',
    padding: '0.5%',
  },
  projectCard: {
    backgroundColor: '#fff',
    width: '32.33%',
    height: 250,
    borderRadius: 3,
    flex: '0 0 auto',
    margin: '0.5%',
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'flex-start',
    padding: 20,
    boxSizing: 'border-box',
    border: '1px solid #eee',
    // boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
    overflow: 'hidden',
    cursor: 'pointer',
    '@media (max-width: 1440px)': {
      width: '49%',
    },
    '@media (max-width: 768px)': {
      width: '99%',
    },
  },
  projectName: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontWeight: 700,
    fontSize: '1.2em',
    margin: '10px 0',
    paddingBottom: 10,
    borderBottom: '1px solid #eee',
    display: 'flex',
    alignItems: 'center',
  },

  projectActivityList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  projectActivityListItem: {
    color: '#444',
    margin: '4px 0',
    flexFlow: '0 0 auto',
    fontSize: '0.8em',
    fontWeight: 300,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
  },
  activityOccured: {
    color: '#aaa',
    fontSize: '0.8em',
    fontWeight: 400,
    width: 80,
    textAlign: 'right',
    margin: 'auto 10px auto 0',
  }
};
