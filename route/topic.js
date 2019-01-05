const express = require("express");
const TopicService = require("../service/topic");

const topicService = new TopicService();
const router = express.Router();

/**
 * 查詢主題統計資料。
 */
router.get("/statistics", async (req, res) => {
  const result = await topicService.findTopicsStatistics();
  res.status(200).json({
    golang: result.golangStatistics,
    nodeJS: result.nodeJSStatistics
  });
});

/**
 * 查詢主題列表。
 */
router.get("/:category", async (req, res) => {
  const category = req.params.category;
  const searchTopic = req.query.searchTopic || "";
  const offset = parseInt(req.query.offset, 10);
  const limit = parseInt(req.query.limit, 10);
  const result = await topicService.findTopics(
    category,
    searchTopic,
    offset,
    limit
  );
  res.status(200).json({
    topics: result.topics,
    totalCount: result.totalCount
  });
});

module.exports = router;
