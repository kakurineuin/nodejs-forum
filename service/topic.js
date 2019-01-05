const sequelize = require("../database/database");
const sqlTemplate = require("../sql/read_template");

/**
 * 處理主題相關功能請求的 service。
 */
class TopicService {
  /**
   * 查詢主題統計資料。
   */
  async findTopicsStatistics() {
    const golangStatistics = await sequelize.query(
      sqlTemplate["FindTopicsGolangStatistics"],
      {
        type: sequelize.QueryTypes.SELECT
      }
    );
    console.log("============= golangStatistics", golangStatistics);
    const nodeJSStatistics = await sequelize.query(
      sqlTemplate["FindTopicsNodeJSStatistics"],
      {
        type: sequelize.QueryTypes.SELECT
      }
    );
    return {
      golangStatistics: golangStatistics[0],
      nodeJSStatistics: nodeJSStatistics[0]
    };
  }
}

module.exports = TopicService;
