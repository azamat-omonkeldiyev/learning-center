const { db, DataTypes } = require("../config/db");
const Region = require("./region.model");

const User = db.define("user", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  region_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Region,
      key: "id",
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("ceo", "user", "admin", "superadmin"),
    allowNull: false,
  },
});

User.belongsTo(Region, { foreignKey: "region_id", onDelete: "CASCADE" });
Region.hasMany(User, { foreignKey: "region_id", onDelete: "CASCADE" });


module.exports = User;
