const {db, DataTypes} = require('../config/db')

const EduCenter = require('./edu_center.model')
const Branch = require('./branch.model')

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

Enrollment.belongsTo(EduCenter, {foreignKey: 'edu_id'})
Enrollment.belongsTo(Branch, {foreignKey: 'branch_id'})

module.exports = Enrollment