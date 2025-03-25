const {db, DataTypes} = require('../config/db')

const EduCenter = require('./edu_center.model')
const FieldsOfEdu = require('./edu_center_fields.model')

const Fields = db.define("fields", {
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

Fields.belongsToMany(EduCenter, {
    through: FieldsOfEdu,
    foreignKey: 'field_id',
    otherKey: 'edu_id'
})

module.exports = Fields