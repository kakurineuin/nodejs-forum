const Sequelize = require("sequelize");
const config = require("config");

const database = config.get("database");

const sequelize = new Sequelize(
  database.dbname,
  database.user,
  database.password,
  {
    dialect: "mysql",
    host: "localhost"
  }
);

module.exports = sequelize;
