const { sequelize, DataTypes, Model } = require('../sequelize-index')

class User extends Model {

}

User.init({
    name: DataTypes.STRING,
    imageLink: DataTypes.STRING,
    password: DataTypes.STRING
})

// define associations

module.exports = { User }