const logger = require("../config/logger");

const errorLogger = (err, req, res, next) => {
  logger.error("Error occurred", {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    query: req.query,
    body: req.body,
    userId: req.userId || "unauthenticated",
  });

  res.status(500).json({ message: err.message || "Internal server error" });
};

module.exports = errorLogger;
