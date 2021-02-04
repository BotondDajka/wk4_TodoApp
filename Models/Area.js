const { sequelize, DataTypes, Model } = require('../sequelize-index')

class Area extends Model {

}

Area.init({
    title: DataTypes.STRING
},{
    sequelize,
    timestamps: false
});



// define associations

module.exports = { Area }