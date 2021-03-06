const sequelize = require("../database/database");
const sqlTemplate = require("../sql/readTemplate");

/**
 * 處理論壇相關功能請求的 service。
 */
class ForumService {
  /**
   * 查詢論壇統計資料。
   */
  async findForumStatistics() {
    const result = await sequelize.query(sqlTemplate["FindForumStatistics"], {
      type: sequelize.QueryTypes.SELECT
    });
    return result[0];
  }
}

module.exports = ForumService;
