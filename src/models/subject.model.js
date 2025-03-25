const {db, DataTypes} = require('../config/db')


const Subjects = db.define("subjects", {
    id: {
        type: DataTypes.INTEGER, 
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})


module.exports = Subjects