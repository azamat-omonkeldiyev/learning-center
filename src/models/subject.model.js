const {db, DataTypes} = require('../config/db')

const EduCenter = require('./edu_center.model')
const SubjectsOfEdu = require('./edu_center_subjects.model')

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

Subjects.belongsToMany(EduCenter, {
    through: SubjectsOfEdu,
    foreignKey: 'subject_id',
    otherKey: 'edu_id',
})

module.exports = Subjects