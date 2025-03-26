const { Sequelize, DataTypes } = require("sequelize");

const db = new Sequelize("lc", "root", "1234", {
  host: "localhost",
  dialect: "mysql",
});

async function connectDb() {
  try {
    await db.authenticate();
    console.log("connected to db");
    // await db.sync({ force: true });
    // console.log("db synced");
  } catch (error) {
    console.log(error);
  }
}

module.exports = { db, connectDb, DataTypes };
