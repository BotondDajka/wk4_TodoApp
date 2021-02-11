const { sequelize, DataTypes, Model } = require('../sequelize-index')
const { Task } = require('./Task')

/**
 * Represents an Area record
 */

class Area extends Model {

}

/**
     * Prepares an Area
     */

Area.init({
    title: DataTypes.STRING,
    boardId: DataTypes.INTEGER
}, 
{
    sequelize,
    timestamps: false,
    freezeTableName: true
})

/**
     * Defines Area model associations
     */
Area.hasMany(Task, {as: 'tasks', foreignKey: 'areaId'})
Task.belongsTo(Area, {foreignKey: 'areaId'})

module.exports = { Area }