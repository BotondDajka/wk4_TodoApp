const { sequelize, DataTypes, Model } = require('../sequelize-index')

class Team extends Model {

}

Team.init({
    name: DataTypes.STRING
},{
    sequelize,
    timestamps: false
});

// define associations

module.exports = { Team }