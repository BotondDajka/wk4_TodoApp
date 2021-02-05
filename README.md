# Todo Application
## About
A smallscale web-based Todo application to keep track of tasks that need to be worked on within a team. Users can register accounts and create boards where they can add their team members. On the boards, users can add columns (e.g. Todo, Doing, Done) where tasks can be added to and dragged around as it moves on in phases. Tasks can be decorated with a title, description, and labels and can be assigned to board members

## Table of Contents
- [Installation](#installation)
- [Features](#features)
- [System Specification](https://github.com/BotondDajka/wk4_TodoApp/wiki/System-Specification)
- [Team Roles](https://github.com/BotondDajka/wk4_TodoApp/wiki/Team-Roles)
- [Design/Modeling](https://github.com/BotondDajka/wk4_TodoApp/wiki/Design-and-Modelling)

## Installation
1.  Clone repo to local directory
2. Run `npm install` to install dependencies
3. Run `node db/prepareDb.js` to generate database
4. Run `node db/mock_data/loadBoards.js`, `node db/mock_data/loadUsers.js` and `node db/mock_data/loadTeams.js` to populate database with mock data
5. Run `node server.js` to run the express webserver
### Known Issues and Fixes
#### Error: Please install sqlite3 package manually
1. Delete node_modules
2. Run `npm install` to install node modules again

## Features
### User
- a private account with login
- custom name
- custom avatar
- unique username
- ability to create boards
### Board
- add users to the board that are part of the team
- create columns with custom titles
- create tasks within columns
- users can drag tasks around columns
### Tasks
- custom title
- custom description
- custom labels
- users assigned to it
