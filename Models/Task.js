const { sequelize, DataTypes, Model } = require('../sequelize-index')

class Task extends Model {

}

Task.init({
    title: DataTypes.STRING,
    text: DataTypes.STRING,
    labels: DataTypes.ARRAY
})

// define associations

module.exports = { Task }