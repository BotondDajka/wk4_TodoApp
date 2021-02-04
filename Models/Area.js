const { sequelize, DataTypes, Model } = require('../sequelize-index')
const { Task } = require('./Task')

class Area extends Model {

}

Area.init({
    title: DataTypes.STRING,
    boardId: DataTypes.INTEGER
}, 
{
    sequelize,
    timestamps: false,
    freezeTableName: true
})

// define associations
Area.hasMany(Task, {as: 'tasks', foreignKey: 'areaId'})
Task.belongsTo(Area, {foreignKey: 'areaId'})

module.exports = { Area }