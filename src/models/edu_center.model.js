const {db, DataTypes} = require('../config/db');
const Region = require('./region.model');
const User = require('./user.model');



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
});

EduCenter.belongsTo(User, { foreignKey: "CEO_id", onDelete: "CASCADE" });
User.hasMany(EduCenter, { foreignKey: "CEO_id", onDelete: "CASCADE" });

EduCenter.belongsTo(Region, { foreignKey: "region_id", onDelete: "CASCADE" });
Region.hasMany(EduCenter, { foreignKey: "region_id", onDelete: "CASCADE" });

module.exports = EduCenter