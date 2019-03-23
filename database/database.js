const Sequelize = require("sequelize");
const config = require("config");

const database =
  process.env.NODE_EVN === "production"
    ? {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        dbname: process.env.DB_NAME
      }
    : config.get("database");

const sequelize = new Sequelize(
  database.dbname,
  database.user,
  database.password,
  {
    dialect: "mysql",
    host: database.host
  }
);

module.exports = sequelize;
