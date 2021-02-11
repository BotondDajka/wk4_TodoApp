const { sequelize, DataTypes, Model } = require('../sequelize-index')

/**
 * Represents a Task record
 */

class Task extends Model {

}

/**
     * Prepares a Task
     */

Task.init({
    title: DataTypes.STRING,
    text: DataTypes.STRING,
    areaId: DataTypes.INTEGER,
    labels: DataTypes.ARRAY(DataTypes.TEXT)
    //userIdAssignedTo: DataTypes.INTEGER
},
{
    sequelize,
    timestamps: false,
    freezeTableName: true
})



module.exports = { Task }