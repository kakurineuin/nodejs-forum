const sequelize = require("../database/database");
const sqlTemplate = require("../sql/read_template");

/**
 * 處理 forum 相關功能請求的 service。
 */
class ForumService {
  async findForumStatistics() {
    const result = await sequelize.query(sqlTemplate["FindForumStatistics"], {
      type: sequelize.QueryTypes.SELECT
    });
    return result[0];
  }
}

module.exports = ForumService;
