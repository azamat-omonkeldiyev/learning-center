const {db, DataTypes} = require('../config/db');
const User = require('./user.model');
const EduCenter = require("./edu_center.model");


const Like = db.define("likes", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    edu_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    }
});

Like.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(Like, { foreignKey: "user_id", onDelete: "CASCADE" });

Like.belongsTo(EduCenter, { foreignKey: "edu_id", onDelete: "CASCADE" });
EduCenter.hasMany(Like, { foreignKey: "edu_id", onDelete: "CASCADE" });


module.exports = Like