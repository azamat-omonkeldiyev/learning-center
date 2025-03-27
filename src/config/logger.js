const { createLogger, format, transports } = require("winston");
const { MongoDB } = require("winston-mongodb");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/imtihon")
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
      db: "mongodb://localhost:27017/imtihon",
      collection: "logger",
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.Console({
      level: "debug",
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
});

module.exports = logger;
