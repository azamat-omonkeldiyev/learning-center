const { db, DataTypes } = require("../config/db");
const Branch = require("./branch.model");
const Field = require("./fields.model");

const BranchField = db.define("BranchField", {
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
    field_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Field,
            key: "id",
        },
        onDelete: "CASCADE",
    },
}, {
    tableName: "branch_fields",
    timestamps: false, 
});

// Many-to-Many aloqalar
Branch.belongsToMany(Field, { 
    through: BranchField, 
    foreignKey: "branch_id",
    otherKey: "field_id",
    as: "fields"
});

Field.belongsToMany(Branch, { 
    through: BranchField, 
    foreignKey: "field_id",
    otherKey: "branch_id",
    as: "branches"
});

module.exports = BranchField;
