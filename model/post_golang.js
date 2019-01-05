const Sequelize = require("sequelize");
const sequelize = require("../database/database");

const PostGolang = sequelize.define(
  "postGolang",
  {
    ID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    userProfileID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: "user_profile_id"
    },
    replyPostID: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: "reply_post_id"
    },
    topic: {
      type: Sequelize.STRING,
      allowNull: false
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false
    },
    createdAt: {
      type: Sequelize.DATE,
      field: "created_at"
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: "updated_at"
    },
    deletedAt: {
      type: Sequelize.DATE,
      field: "deleted_at"
    }
  },
  { tableName: "post_golang" }
);

module.exports = PostGolang;
