const { sequelize, DataTypes, Model } = require('../sequelize-index')
const { Area } = require('./Area')

class Board extends Model {

}

Board.init({
    name: DataTypes.STRING,
    assignedTeamId: DataTypes.INTEGER // store IDs
},
{
    sequelize,
    timestamps: false,
    freezeTableName: true
})

// define associations
Board.hasMany(Area, {as: 'areas', foreignKey: 'boardId'})
Area.belongsTo(Board, {foreignKey: 'boardId'})

module.exports = { Board }