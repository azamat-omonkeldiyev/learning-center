const {db, DataTypes}  = require('../config/db')

const EduCenter = require('./edu_center.model')
const Subjects = require('./subject.model')

const SubjectsOfEdu = db.define("subjectsOfEdu", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    edu_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    subject_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
})

SubjectsOfEdu.belongsTo(EduCenter, {foreignKey: 'edu_id'})
SubjectsOfEdu.belongsTo(Subjects, {foreignKey: 'subject_id'})

module.exports = SubjectsOfEdu