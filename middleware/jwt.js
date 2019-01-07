const expressJwt = require("express-jwt");
const config = require("config");

const JWT_SECRET = config.get("jwtSecret");

module.exports = expressJwt({ secret: JWT_SECRET });
