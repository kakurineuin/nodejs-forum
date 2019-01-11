const CustomError = require("../error/CustomError");
const logger = require("../logger/logger");

/**
 * 錯誤處理 middleware。
 */
module.exports = function(err, req, res, next) {
  logger.error(err.message, err);

  if (err instanceof CustomError) {
    res.status(err.httpStatusCode).json({
      message: err.message
    });
  } else {
    res.status(500).json({
      message: "系統發生錯誤。"
    });
  }
};
