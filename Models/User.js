const { sequelize, DataTypes, Model } = require('../sequelize-index')

class User extends Model {

}

User.init({
    name: DataTypes.STRING,
    imageLink: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING
},{
    sequelize,
    timestamps: false
});

// define associations

module.exports = { User }