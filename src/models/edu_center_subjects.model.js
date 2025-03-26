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

EduCenter.belongsToMany(Subjects, {
    through: SubjectsOfEdu,
    foreignKey: "edu_id",
    otherKey: "subject_id",
    as: "subjects",
  });
  
Subjects.belongsToMany(EduCenter, {
    through: SubjectsOfEdu,
    foreignKey: "subject_id",
    otherKey: "edu_id",
    as: "eduCenters",
  });

module.exports = SubjectsOfEdu