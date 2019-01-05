const express = require("express");
const ForumService = require("../service/forum");

const forumService = new ForumService();
const router = express.Router();

router.get("/statistics", async (req, res) => {
  const forumStatistics = await forumService.findForumStatistics();
  res.status(200).json({
    forumStatistics: forumStatistics
  });
});

module.exports = router;
