![Pivotal.Press logo](https://dl.dropboxusercontent.com/s/fc4pn06d68stigg/pp-logo-sm.png)

# PIVOTAL.PRESS
A PivotalTracker client for managing stories.

## Local Install & Setup
1. Clone the repo: `git clone https://github.com/asidiali/pivotal.press.git`
2. Navigate to the repo folder and install dependencies: `npm i`
3. Install Webpack globally if you don't have it (optional): `npm i -g webpack`

## Running Locally
1. Start the dev server: `npm run dev`
2. Navigate to `http://localhost:8080/` to view the app

---

### To do

This app is currently a work in progress. Reporting any bugs/issues you find is always appreciated!

- [ ] View
  - [x] ~~user~~
  - [x] ~~projects~~
  - [x] ~~projects details~~
  - [x] ~~stories in project~~
    - [x] ~~filter stories by~~
      - [x] ~~type~~
      - [x] ~~stage~~
      - [x] ~~owner~~
      - [x] ~~labels~~
    - [ ] sort stories by
      - [x] ~~updated (default)~~
      - [ ] created
      - [ ] stage
      - [ ] type
  - [x] ~~labels in project~~
  - [ ] members in project
  - [ ] story details
- [ ] Edit
  - [ ] project
    - [ ] name
    - [ ] stories
  - [ ] story
    - [ ] name
    - [ ] description
    - [ ] type
    - [ ] stage
    - [ ] owner
    - [ ] labels
- [ ] Misc
  - [x] ~~UX - Real-time - setup polling to enable real-time changes~~
  - [x] ~~UI - project cards activity feed~~
  - [x] ~~UI - real-time project history feed sidebar~~
  - [ ] Performance - projects stories list pagination
  - [ ] Performance - improve story search query functionality (by word)
  - [ ] UI - add owner/member detail to story cards
  - [ ] UX - click on stage, type tags to filter
  - [ ] UX - refactor requests for offline capability
  - [ ] UI - kanban board view by stage
  - [ ] UI - project carousel view
- [ ] Accounts
  - [x] ~~incorrect API key check~~
  - [ ] revamp login page, check for `pp-me` before routing
  - [ ] pass account via `props` instead of `ls`
  - [ ] add tooltip/note to home page on where to find PT API key

---

# Contributing

All help is welcome! Please be sure to checkout the [contribution guidelines](#).

## Contributors
- Adam Sidiali [[Gh](http://github.com/asidiali)] [[Tw](http://twitter.com/adamsidiali)]

## License
MIT [[LICENSE](https://github.com/asidiali/pivotal.press/blob/master/LICENSE.md)]
