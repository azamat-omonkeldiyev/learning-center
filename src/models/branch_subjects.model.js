const { db, DataTypes } = require("../config/db");
const Branch = require("./branch.model");
const Subject = require("./subject.model");

const BranchSubject = db.define("BranchSubject", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    branch_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Branch,
            key: "id",
        },
        onDelete: "CASCADE",
    },
    subject_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Subject,
            key: "id",
        },
        onDelete: "CASCADE",
    },
}, {
    tableName: "branch_subjects", 
    timestamps: false, 
});

Branch.belongsToMany(Subject, { 
    through: BranchSubject, 
    foreignKey: "branch_id",
    otherKey: "subject_id",
    as: "subjects"
});

Subject.belongsToMany(Branch, { 
    through: BranchSubject, 
    foreignKey: "subject_id",
    otherKey: "branch_id",
    as: "branches"
});

module.exports = BranchSubject;
