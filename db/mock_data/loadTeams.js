const { Team } = require('../../Models/Team')

Team.create({name: "Test Team 1", usersList: [1, 4]})
Team.create({name: "Test Team 2", usersList: [3]})
Team.create({name: "Test Team 3", usersList: [2]})