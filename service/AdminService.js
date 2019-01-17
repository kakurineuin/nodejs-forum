const Sequelize = require("sequelize");
const UserProfile = require("../model/userProfile");

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

    return await UserProfile.findAndCountAll(options);
  }

  /**
   * 停用使用者。
   *
   * @param {number} id
   */
  async disableUser(id) {
    const userProfie = await UserProfile.findByPk(id);
    userProfie.isDisabled = 1;
    await userProfie.save();
    return await UserProfile.findByPk(id, {
      attributes: ["id", "username", "email", "role", "isDisabled", "createdAt"]
    });
  }
}

module.exports = AdminService;
