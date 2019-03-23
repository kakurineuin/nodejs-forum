const expressJwt = require("express-jwt");
const config = require("config");

const JWT_SECRET =
  process.env.NODE_ENV === "production"
    ? process.env.JWT_SECRET
    : config.get("jwtSecret");

module.exports = expressJwt({ secret: JWT_SECRET, credentialsRequired: false });
