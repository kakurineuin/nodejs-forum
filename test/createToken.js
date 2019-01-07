const jwt = require("jsonwebtoken");
const config = require("config");

const JWT_SECRET = config.get("jwtSecret");

/**
 * 產生 JWT。
 */
function createToken(userProfileId) {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 72;
  const token = jwt.sign(
    {
      id: userProfileId,
      username: "admin",
      email: "admin@xxx.com",
      role: "admin",
      exp
    },
    JWT_SECRET
  );
  return token;
}

module.exports = createToken;
