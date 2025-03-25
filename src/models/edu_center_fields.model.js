const {db, DataTypes} = require('../config/db')

const EduCenter = require('./edu_center.model')
const Fields = require('./fields.model')

const FieldsOfEdu = db.define("fieldsOfEdu", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    edu_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    field_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
})

FieldsOfEdu.belongsTo(EduCenter, {foreignKey: 'edu_id'})
FieldsOfEdu.belongsTo(Fields, {foreignKey: 'field_id'})

module.exports = FieldsOfEdu