const express = require("express");
const jwtMiddleware = require("../middleware/jwt");
const Joi = require("joi");
const { myJoi, validate } = require("../validate/joiOptions");
const TopicService = require("../service/TopicService");

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

/**
 * 查詢某個主題的討論文章。
 */
router.get("/:category/:id", async (req, res) => {
  const category = req.params.category;
  const id = parseInt(req.params.id, 10);
  const offset = parseInt(req.query.offset, 10);
  const limit = parseInt(req.query.limit, 10);
  const result = await topicService.findTopic(category, id, offset, limit);
  res.status(200).json({
    posts: result.posts,
    totalCount: result.totalCount
  });
});

/**
 * 新增文章。
 */
router.post("/:category", jwtMiddleware, async (req, res) => {
  const schema = myJoi.keys({
    replyPostId: Joi.number().optional(),
    userProfileId: Joi.number().required(),
    topic: Joi.string()
      .min(1)
      .max(30)
      .required()
      .label("主題"),
    content: Joi.string()
      .min(1)
      .max(20000)
      .required()
      .label("內文")
  });
  const message = validate(req.body, schema);

  if (message) {
    return res.status(400).json({
      message
    });
  }

  const category = req.params.category;
  const post = await topicService.createPost(category, req.body);
  res.status(201).json({
    message: post.replyPostId ? "回覆成功。" : "新增主題成功。",
    post
  });
});

/**
 * 修改文章。
 */
router.put("/:category/:id", jwtMiddleware, async (req, res) => {
  const schema = myJoi.keys({
    content: Joi.string()
      .min(1)
      .max(20000)
      .required()
      .label("內文")
  });
  const message = validate(req.body, schema);

  if (message) {
    return res.status(400).json({
      message
    });
  }

  const category = req.params.category;
  const id = parseInt(req.params.id, 10);
  const post = await topicService.updatePost(category, id, req.body, req.user);
  res.status(200).json({
    message: "修改文章成功。",
    post: post
  });
});

/**
 * 刪除文章。
 */
router.delete("/:category/:id", jwtMiddleware, async (req, res) => {
  const category = req.params.category;
  const id = parseInt(req.params.id, 10);
  const post = await topicService.deletePost(category, id, req.user);
  res.status(200).json({
    message: "刪除文章成功。",
    post: post
  });
});

module.exports = router;
