export default {
  base: {},
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
    borderTop: '0px solid #ddd',
    borderRight: '1px solid #ddd',
    borderLeft: '1px solid #ddd',
    borderBottom: '2px solid #ddd',
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
  },

  projectActivityList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  projectActivityListItem: {
    color: '#aaa',
    margin: '2px 0',
    flexFlow: '0 0 auto',
    fontSize: '0.9em',
  }
};
