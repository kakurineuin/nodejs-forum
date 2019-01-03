const Sequelize = require("sequelize");
const UserProfile = require("../model/user_profile");

const op = Sequelize.Op;

/**
 * 處理 admin 功能請求的 service。
 */
class AdminService {
  /**
   * 查詢使用者。
   *
   * @param {string} searchUser
   * @param {number} offset
   * @param {number} limit
   */
  async findUsers(searchUser, offset, limit) {
    const options = {
      attributes: [
        "id",
        "username",
        "email",
        "role",
        "isDisabled",
        "createdAt"
      ],
      offset,
      limit
    };

    if (searchUser) {
      options.where = {
        username: {
          [op.like]: "%" + searchUser + "%"
        }
      };
    }

    try {
      return await UserProfile.findAndCountAll(options);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  /**
   * 停用使用者。
   *
   * @param {number} id
   */
  async disableUser(id) {
    try {
      const userProfie = await UserProfile.findByPk(id);
      userProfie.isDisabled = 1;
      await userProfie.save();
      return await UserProfile.findByPk(id, {
        attributes: [
          "id",
          "username",
          "email",
          "role",
          "isDisabled",
          "createdAt"
        ]
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

module.exports = AdminService;
