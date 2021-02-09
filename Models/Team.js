const { sequelize, DataTypes, Model } = require('../sequelize-index')
const { Board } = require('./Board')
const { User } = require('./User')

class Team extends Model {

}

Team.init({
    name: DataTypes.STRING,
    usersList: DataTypes.ARRAY(DataTypes.INTEGER) // store reference to user's id in users table
},
{
    sequelize,
    timestamps: false,
    freezeTableName: true
})

// define associations
Team.hasMany(Board, {as: 'boards', foreignKey: 'assignedTeamId'})
Board.belongsTo(Team, {foreignKey: 'assignedTeamId'})
//Team.hasMany(User, {as: 'users', foreignKey: 'teamId'})

module.exports = { Team }