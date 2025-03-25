const {db, DataTypes} = require('../config/db')

const Branch = require('./branch.model')
const Enrollment = require('./course_register.model')
const Subjects = require('./subject.model')
const Fields = require('./fields.model')
const SubjectsOfEdu = require('./edu_center_subjects.model')
const FieldsOfEdu = require('./edu_center_fields.model')

const EduCenter = db.define("educenters", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING, 
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    region_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    branchCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    CEO_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
})

EduCenter.hasMany(Branch, {foreignKey: 'edu_id'})
EduCenter.hasMany(Enrollment, {foreignKey: 'edu_id'})

EduCenter.belongsToMany(Subjects, {
    through: SubjectsOfEdu,
    foreignKey: 'edu_id',
    otherKey: 'subject_id'
})
EduCenter.belongsToMany(Fields, {
    through: FieldsOfEdu,
    foreignKey: 'edu_id',
    otherKey: 'field_id'
})

module.exports = EduCenter