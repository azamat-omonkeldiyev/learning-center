const {db, DataTypes} = require('../config/db');
const resCategory = require('./res-category.model');
const User = require('./user.model');

const Resource = db.define("resources", {
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
    },
    file: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    }
});

Resource.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(Resource, { foreignKey: "user_id", onDelete: "CASCADE" });

Resource.belongsTo(resCategory, { foreignKey: "edu_id", onDelete: "CASCADE" });
resCategory.hasMany(Resource, { foreignKey: "edu_id", onDelete: "CASCADE" });


module.exports = Resource