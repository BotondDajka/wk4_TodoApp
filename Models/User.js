const { sequelize, DataTypes, Model } = require('../sequelize-index')

class User extends Model {

}

User.init({
    username: {
        type: DataTypes.STRING,
        allowNull: false // name is required for auth purposes
    },
    displayName: DataTypes.STRING,
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