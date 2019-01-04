const express = require("express");
const jwt = require("jsonwebtoken");
const { addHours } = require("date-fns");
const AuthService = require("../service/auth");

// JWT secret key。
const JWT_SECRET = "die_meere";

// JWT 幾小時後過期。
const JWT_EXP_HOURS = 72;
const authService = new AuthService();
const router = express.Router();

/**
 * 註冊。
 */
router.post("/register", async (req, res) => {
  // TODO: 使用 Joi 驗證參數。

  const userProfile = await authService.register(
    req.body.username,
    req.body.email,
    req.body.password
  );
  userProfile.password = ""; // 密碼不能傳到前端。
  returnResponse(res, userProfile, "註冊成功。");
});

/**
 * 登入。
 */
router.post("/login", async (req, res) => {
  // TODO: 使用 Joi 驗證參數。

  const userProfile = await authService.login(
    req.body.email,
    req.body.password
  );
  userProfile.password = ""; // 密碼不能傳到前端。
  returnResponse(res, userProfile, "登入成功。");
});

/**
 * 產生 JWT。
 *
 * @param {Object} userProfile
 */
function createToken(userProfile) {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * JWT_EXP_HOURS;
  const token = jwt.sign(
    {
      id: userProfile.id,
      username: userProfile.username,
      email: userProfile.email,
      role: userProfile.role,
      exp
    },
    JWT_SECRET
  );
  return { token, exp };
}

/**
 * 返回 response。
 *
 * @param {Objcet} res
 * @param {Object} userProfile
 * @param {string} message
 */
function returnResponse(res, userProfile, message) {
  const jwt = createToken(userProfile);
  res.status(200).json({
    message,
    userProfile,
    token: jwt.token,
    exp: jwt.exp
  });
}

module.exports = router;
