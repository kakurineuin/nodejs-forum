const sequelize = require("./database/database");
const logger = require("./logger/logger");
const app = require("./app");

sequelize
  .sync()
  .then(result => {
    logger.info("sequelize sync result", result);
    app.listen(3000, () => {
      logger.info("server is listening...");
    });
  })
  .catch(err => {
    logger.error(err.message, err);
  });
