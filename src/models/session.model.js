const {db, DataTypes} = require("./../config/db");

const Session = db.define(
    "session",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        ip_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        device_data:{
            type: DataTypes.JSON,
            allowNull: false
        }
    },
);

module.exports = Session;