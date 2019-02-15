const path = require("path");
const winston = require("winston");
require("winston-daily-rotate-file");

const consoleLogger = new winston.transports.Console({
  colorize: true,
  prettyPrint: true
});
const dailyRotateFile = new winston.transports.DailyRotateFile({
  filename: "application-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  dirname: path.join(__dirname, "..", "log"),
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d"
});

const logger = winston.createLogger({
  transports: [consoleLogger, dailyRotateFile]
});

module.exports = logger;
