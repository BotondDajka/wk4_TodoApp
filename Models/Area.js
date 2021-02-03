const { sequelize, DataTypes, Model } = require('../sequelize-index')

class Area extends Model {

}

Area.init({
    title: DataTypes.STRING
})

// define associations

module.exports = { Area }