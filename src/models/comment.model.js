const {db, DataTypes} = require('../config/db');
const Branch = require('./branch.model');
const EduCenter = require('./edu_center.model');
const User = require('./user.model');

const Comment = db.define("comments", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    star: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    edu_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    branch_id: { 
        type: DataTypes.UUID,
        allowNull: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    }
});

Comment.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(Comment, { foreignKey: "user_id", onDelete: "CASCADE" });

Comment.belongsTo(EduCenter, { foreignKey: "edu_id", onDelete: "CASCADE" });
EduCenter.hasMany(Comment, { foreignKey: "edu_id", onDelete: "CASCADE" });

Comment.belongsTo(Branch, { foreignKey: "branch_id", onDelete: "CASCADE" });
Branch.hasMany(Comment, { foreignKey: "branch_id", onDelete: "CASCADE" });

module.exports = Comment;
