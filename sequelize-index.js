const { Sequelize, DataTypes, Model } = require('sequelize')

const sequelize = new Sequelize('database', 'username', 'password', 
    {
        dialect: 'sqlite',
        storage: './todo_app.sqlite'
    }
)

module.exports = { sequelize, DataTypes, Model }