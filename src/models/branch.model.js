const { db, DataTypes } = require("../config/db");

const EduCenter = require("./edu_center.model");

const Branch = db.define("branches", {
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
  edu_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

EduCenter.hasMany(Branch, {
    foreignKey: "edu_id",
    onDelete: "CASCADE",
    as: "branches", 
  });
  
Branch.belongsTo(EduCenter, {
    foreignKey: "edu_id",
    onDelete: "CASCADE",
    as: "educenter",
  });

module.exports = Branch;
