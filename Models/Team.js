const { sequelize, DataTypes, Model } = require('../sequelize-index')
const { Board } = require('./Board')
const { User } = require('./User')

/**
 * Represents a Team record
 */

class Team extends Model {

}

/**
 * Prepares a Team
 */

Team.init({
    name: DataTypes.STRING,
    usersList: DataTypes.ARRAY(DataTypes.INTEGER) // store reference to user's id in users table
},
{
    sequelize,
    timestamps: false,
    freezeTableName: true
})

/**
 * Defines Team model associations
 */
Team.hasMany(Board, {as: 'boards', foreignKey: 'teamId'})
Board.belongsTo(Team, {foreignKey: 'teamId'})
Team.hasMany(User, {as: 'users', foreignKey: 'teamId'})

module.exports = { Team }