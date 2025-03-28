const { createLogger, format, transports } = require("winston");
const { MongoDB } = require("winston-mongodb");
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODBURI)
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.error("Mongodb connection error");
  });

const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.json(),
  format.metadata()
);

const logger = createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new transports.File({
      filename: "logs/app.log",
      level: "info",
    }),
    new transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new MongoDB({
      level: "info",
      db: process.env.MONGODBURI,
      collection: "logger",
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

module.exports = logger;
