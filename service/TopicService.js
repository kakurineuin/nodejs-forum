const _ = require("lodash");
const sequelize = require("../database/database");
const sqlTemplate = require("../sql/read_template");
const CustomError = require("../error/CustomError");

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
    const model = sequelize.model("post" + _.capitalize(category));
    const createdPost = await model.create(post);
    return createdPost.get({
      plain: true
    });
  }

  /**
   * 修改文章。
   *
   * @param {string} category
   * @param {number} id
   * @param {Object} post
   * @param {Object} user
   */
  async updatePost(category, id, postOnUpdate, user) {
    const model = sequelize.model("post" + _.capitalize(category));
    const post = await model.findByPk(id);

    // 不能修改已刪除的文章。
    if (post.deletedAt) {
      throw new CustomError(400, "不能修改已刪除的文章。");
    }

    // 不能修改別人的文章。
    if (post.userProfileId !== user.id) {
      throw new CustomError(400, "不能修改別人的文章。");
    }

    // 修改文章。
    post.content = postOnUpdate.content;
    await post.save();
    return post.get({ plain: true });
  }

  /**
   * 刪除文章。
   *
   * @param {string} category
   * @param {number} id
   * @param {Object} user
   */
  async deletePost(category, id, user) {
    const model = sequelize.model("post" + _.capitalize(category));
    let post = await model.findByPk(id);

    // 不是系統管理員則不能刪除別人的文章。
    if (user.Role !== "admin" && post.userProfileId !== user.id) {
      throw new CustomError(400, "不能刪除別人的文章。");
    }

    // 不是真的刪除，而是修改文章內容並更新刪除時間欄位。
    try {
      await sequelize.transaction(async t => {
        post.content = "此篇文章已被刪除。";
        post = await post.save({ transaction: t });
        await post.destroy({ transaction: t });
      });
      post = await model.findByPk(id, { paranoid: false });
      return post.get({ plain: true });
    } catch (err) {
      console.log(err);
      throw err;
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
