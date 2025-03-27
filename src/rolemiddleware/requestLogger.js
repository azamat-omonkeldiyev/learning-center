const logger = require("../config/logger");

const requestLogger = (req, res, next) => {
  const start = Date.now();

  logger.info("Incoming request", {
    method: req.method,
    url: req.url,
    query: req.query,
    body: req.body,
    userId: req.userId || "unauthenticated",
  });

  const originalJson = res.json;
  res.json = function (data) {
    const duration = Date.now() - start;
    logger.info("Response sent", {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userId: req.userId || "unauthenticated",
      response: data,
    });
    return originalJson.call(this, data);
  };

  next();
};

module.exports = requestLogger;
