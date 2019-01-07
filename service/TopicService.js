const sequelize = require("../database/database");
const PostGolang = require("../model/post_golang");
const PostNodejs = require("../model/post_nodejs");
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

  /**
   * 查詢主題列表。
   *
   * @param {string} category
   * @param {string} searchTopic
   * @param {number} offset
   * @param {number} limit
   */
  async findTopics(category, searchTopic, offset, limit) {
    const table = getTable(category);
    searchTopic = "%" + searchTopic + "%";
    let statement = sqlTemplate["FindTopics"].replace(/%v/g, table);
    const topics = await sequelize.query(statement, {
      replacements: [searchTopic, offset, limit],
      type: sequelize.QueryTypes.SELECT
    });

    // 查詢總筆數。
    statement = sqlTemplate["FindTopicsTotalCount"].replace(/%v/g, table);
    const result = await sequelize.query(statement, {
      replacements: [searchTopic],
      type: sequelize.QueryTypes.SELECT
    });

    return {
      topics,
      totalCount: result[0].totalCount
    };
  }

  /**
   * 查詢某個主題的討論文章。
   *
   * @param {string} category
   * @param {number} id
   * @param {number} offset
   * @param {number} limit
   */
  async findTopic(category, id, offset, limit) {
    const table = getTable(category);
    let statement = sqlTemplate["FindTopic"].replace(/%v/g, table);
    const posts = await sequelize.query(statement, {
      replacements: [id, id, offset, limit],
      type: sequelize.QueryTypes.SELECT
    });

    // 查詢總筆數。
    statement = sqlTemplate["FindTopicTotalCount"].replace(/%v/g, table);
    const result = await sequelize.query(statement, {
      replacements: [id, id],
      type: sequelize.QueryTypes.SELECT
    });

    return {
      posts,
      totalCount: result[0].totalCount
    };
  }

  /**
   * 新增文章。
   *
   * @param {string} category
   * @param {Object} post
   */
  async createPost(category, post) {
    let createdPost = null;
    switch (category) {
      case "golang":
        createdPost = await PostGolang.create(post);
        return createdPost.get({
          plain: true
        });
      case "nodejs":
        createdPost = await PostNodejs.create(post);
        return createdPost.get({
          plain: true
        });
      default:
        throw new Error("category is error");
    }
  }
}

function getTable(category) {
  switch (category) {
    case "golang":
      return "post_golang";
    case "nodejs":
      return "post_nodejs";
    default:
      throw new Error("category is error");
  }
}
module.exports = TopicService;
