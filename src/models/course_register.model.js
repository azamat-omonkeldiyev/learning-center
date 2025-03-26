const {db, DataTypes} = require('../config/db')

const EduCenter = require('./edu_center.model')
const Branch = require('./branch.model')
const User = require('./user.model')

const Enrollment = db.define("enrollment", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    edu_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    branch_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
})

Enrollment.belongsTo(EduCenter, { foreignKey: "edu_id", onDelete: "CASCADE" });
EduCenter.hasMany(Enrollment, { foreignKey: "edu_id", onDelete: "CASCADE" });

Enrollment.belongsTo(Branch, { foreignKey: "branch_id", onDelete: "CASCADE" });
Branch.hasMany(Enrollment, { foreignKey: "branch_id", onDelete: "CASCADE" });

Enrollment.belongsTo(User, {foreignKey: "user_id", onDelete: "CASCADE"});
User.hasMany(Enrollment, { foreignKey: "user_id", onDelete: "CASCADE"});


module.exports = Enrollment