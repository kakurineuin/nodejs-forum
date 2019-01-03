const Sequelize = require("sequelize");
const config = require("../config/config.json");

const sequelize = new Sequelize(
  config.database.dbname,
  config.database.user,
  config.database.password,
  {
    dialect: "mysql",
    host: "localhost"
  }
);

module.exports = sequelize;
