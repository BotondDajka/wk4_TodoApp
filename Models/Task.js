const { sequelize, DataTypes, Model } = require('../sequelize-index')

class Task extends Model {

}

Task.init({
    title: DataTypes.STRING,
    text: DataTypes.STRING,
    labels: DataTypes.ARRAY(DataTypes.STRING)
},{
    sequelize,
    timestamps: false
});

// define associations

module.exports = { Task }