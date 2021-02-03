const { sequelize, DataTypes, Model } = require('../sequelize-index')

class Board extends Model {

}

Board.init({
    name: DataTypes.STRING
})

// define associations

module.exports = { Board }