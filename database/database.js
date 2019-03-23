const Sequelize = require("sequelize");
const config = require("config");

const database =
  process.env.NODE_ENV === "production"
    ? {
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        host: process.env.DATABASE_HOST,
        dbname: process.env.DATABASE_NAME
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
