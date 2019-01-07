/**
 * 自訂錯誤。可設定 HTTP 狀態碼和錯誤訊息。
 */
class CustomError extends Error {
  constructor(httpStatusCode, message) {
    super(message);
    this.httpStatusCode = httpStatusCode;
  }
}

module.exports = CustomError;
