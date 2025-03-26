const { db, DataTypes } = require("../config/db");
const EduCenter = require("./edu_center.model");
const Fields = require("./fields.model");

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
}, {
    tableName: "fieldsOfEdu", 
});

EduCenter.belongsToMany(Fields, { 
    through: FieldsOfEdu, 
    foreignKey: "edu_id",
    otherKey: "field_id",
    as: "fields"
});

Fields.belongsToMany(EduCenter, { 
    through: FieldsOfEdu, 
    foreignKey: "field_id",
    otherKey: "edu_id",
    as: "eduCenters"
});


module.exports = FieldsOfEdu;
