const { sequelize, DataTypes, Model } = require('../sequelize-index')

class Board extends Model {

}

Board.init({
    name: DataTypes.STRING
},{
    sequelize,
    timestamps: false
});



// define associations

module.exports = { Board }