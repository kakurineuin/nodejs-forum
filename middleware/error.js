const CustomError = require("../error/CustomError");

/**
 * 錯誤處理 middleware。
 */
module.exports = function(err, req, res, next) {
  // TODO: 使用日誌套件記錄錯誤訊息。
  console.log("======= error =======", error);

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
