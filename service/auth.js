const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const UserProfile = require("../model/user_profile");
const CustomError = require("../error/error");

const op = Sequelize.Op;
const ROLE_USER = "user"; // 角色：一般使用者。

/**
 * 處理 auth 功能請求的 service。
 */
class AuthService {
  /**
   * 註冊。
   *
   * @param {string} username
   * @param {string} email
   * @param {string} password
   */
  async register(username, email, password) {
    // 檢查使用者名稱是否已被使用。
    let count = await UserProfile.count({ where: { username } });

    if (count > 0) {
      throw new CustomError(400, "此使用者名稱已被使用。");
    }

    // 檢查 email 是否已被使用。
    count = await UserProfile.count({ where: { email } });

    if (count > 0) {
      throw new CustomError(400, "此 email 已被使用。");
    }

    // 加密密碼。
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return await UserProfile.create({
      username,
      email,
      password: hash,
      role: ROLE_USER,
      isDisabled: 0
    });
  }

  /**
   * 登入。
   *
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    // 檢查帳號是否存在。
    const userProfile = await UserProfile.findOne({ where: { email } });

    if (!userProfile) {
      throw new CustomError(404, "查無此 email 帳號。");
    }

    // 檢查帳號是否已被停用。
    if (userProfile.isDisabled === 1) {
      throw new CustomError(403, "此帳號已被停用。");
    }

    // 核對密碼。
    const result = await bcrypt.compare(password, userProfile.password);

    if (!result) {
      throw new CustomError(400, "密碼錯誤。");
    }

    return userProfile;
  }
}

module.exports = AuthService;
