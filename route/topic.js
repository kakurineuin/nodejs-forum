const express = require("express");
const TopicService = require("../service/topic");

const topicService = new TopicService();
const router = express.Router();

router.get("/statistics", async (req, res) => {
  const result = await topicService.findTopicsStatistics();
  res.status(200).json({
    golang: result.golangStatistics,
    nodeJS: result.nodeJSStatistics
  });
});

module.exports = router;
