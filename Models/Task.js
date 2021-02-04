const { sequelize, DataTypes, Model } = require('../sequelize-index')

class Task extends Model {

}

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

// define associations


module.exports = { Task }