const { sequelize, DataTypes, Model } = require('../sequelize-index')

class User extends Model {

}

User.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false // name is required for auth purposes
    },
    imageLink: DataTypes.STRING, // if null, display a default image(?)
    password: {
        type: DataTypes.STRING,
        allowNull: false // password is required for auth purposes
    },
    teamIdAssignedTo: DataTypes.ARRAY(DataTypes.INTEGER) // store IDs
},
{
    sequelize,
    timestamps: false,
    freezeTableName: true
})

// define associations

module.exports = { User }