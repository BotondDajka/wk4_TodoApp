const { sequelize, DataTypes, Model } = require('../sequelize-index')

class User extends Model {

}

User.init({
    name: DataTypes.STRING,
    imageLink: DataTypes.STRING,
    password: DataTypes.STRING,
    teamIdAssignedTo: DataTypes.ARRAY(DataTypes.INTEGER) // store IDs
},
{
    sequelize,
    timestamps: false,
    freezeTableName: true
})

// define associations

module.exports = { User }