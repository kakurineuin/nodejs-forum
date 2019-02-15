const winston = require("winston");
const sequelize = require("./database/database");
const logger = require("./logger/logger");
const app = require("./app");

winston.exceptions.handle(
  new winston.transports.Console({ colorize: true, prettyPrint: true }),
  new winston.transports.File({ filename: "uncaughtExceptions.log" })
);

process.on("unhandledRejection", err => {
  throw err;
});

sequelize
  .sync()
  .then(result => {
    logger.info("sequelize sync result", result);
    app.listen(3000, () => {
      logger.info("server is listening...");
    });
  })
  .catch(err => {
    throw err;
  });
