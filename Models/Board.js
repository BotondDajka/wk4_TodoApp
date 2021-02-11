const { sequelize, DataTypes, Model } = require('../sequelize-index')
const { Area } = require('./Area')

/**
 * Represents an Board record
 */

class Board extends Model {

}

/**
 * Prepares a Board
 */

Board.init({
    name: DataTypes.STRING,
    assignedTeamId: DataTypes.INTEGER // store IDs
},
{
    sequelize,
    timestamps: false,
    freezeTableName: true
})

/**
 * Defines Board model associations
 */
Board.hasMany(Area, {as: 'areas', foreignKey: 'boardId'})
Area.belongsTo(Board, {foreignKey: 'boardId'})

module.exports = { Board }