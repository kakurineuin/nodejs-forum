const Sequelize = require("sequelize");
const sequelize = require("../database/database");

const UserProfile = sequelize.define(
  "userProfile",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false
    },
    isDisabled: {
      type: Sequelize.TINYINT,
      allowNull: true,
      field: "is_disabled"
    },
    createdAt: {
      type: Sequelize.DATE,
      field: "created_at"
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: "updated_at"
    }
  },
  { tableName: "user_profile" }
);

module.exports = UserProfile;
