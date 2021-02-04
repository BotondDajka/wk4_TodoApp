const { sequelize } = require('../sequelize-index')
const { Area } = require('../Models/Area')
const { Board } = require('../Models/Board')
const { Task } = require('../Models/Task')
const { Team } = require('../Models/Team')
const { User } = require('../Models/User')

// prepareDb function to create tables etc
async function prepareDb() {
    // initialise database
    await sequelize.sync()
}

// promise handle
prepareDb().then(() => {
    console.log('DB Setup')
}).catch((err) => {
    console.log(err)
})