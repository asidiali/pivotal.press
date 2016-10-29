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
    width: '24%',
    height: 250,
    borderRadius: 3,
    flex: '0 0 auto',
    margin: '0.5%',
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'flex-end',
    padding: 20,
    boxSizing: 'border-box',
    borderTop: '0px solid #ddd',
    borderRight: '1px solid #ddd',
    borderLeft: '1px solid #ddd',
    borderBottom: '2px solid #ddd',
    fontWeight: 700,
    fontSize: '1.2em',
    overflow: 'hidden',
    cursor: 'pointer',
    '@media (max-width: 1200px)': {
      width: '32.33%',
    },
    '@media (max-width: 900px)': {
      width: '49%',
    },
    '@media (max-width: 600px)': {
      width: '99%',
    },
  },
  projectName: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};
