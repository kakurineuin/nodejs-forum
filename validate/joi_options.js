const Joi = require("joi");

module.exports.myJoi = Joi.object().options({
  abortEarly: false,
  language: {
    any: {
      required: "必填。"
    },
    string: {
      alphanum: "只能英文字母或數字。",
      min: "長度必須至少為{{lmit}}個字。",
      max: "長度必須小於或等於{{limit}}個字。",
      email: "email格式不正確。"
    }
  }
});

/**
 * 使用 Joi 驗證參數並只返回 Joi 結果中的錯誤訊息，若驗證成功則回傳 null。
 */
module.exports.validate = (value, schema) => {
  const result = Joi.validate(value, schema);
  return result.error
    ? result.error.details.map(value => value.message).join(";")
    : null;
};
