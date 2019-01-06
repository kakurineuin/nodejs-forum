const request = require("supertest");
const sequelize = require("../../database/database");
const UserProfile = require("../../model/user_profile");
const PostGolang = require("../../model/post_golang");
const PostNodejs = require("../../model/post_nodejs");
const app = require("../../app");

describe("Topic Handler", () => {
  let userProfileID = null;
  let postGolang = null;
  let server = null;

  beforeAll(async () => {
    await sequelize.sync();
    server = app.listen(3000);
  });

  afterAll(async () => {
    server.close();
  });

  beforeEach(async () => {
    // 新增一名使用者。
    const userProfile = await UserProfile.create({
      username: "test001",
      email: "test001@xxx.com",
      password: "$2a$10$041tGlbd86T90uNSGbvkw.tSExCrlKmy37QoUGl23mfW7YGJjUVjO",
      role: "user"
    });
    userProfileID = userProfile.ID;

    // 新增 post_golang 主題。
    postGolang = await PostGolang.create({
      userProfileID,
      topic: "測試主題001",
      content: "內容..."
    });

    // 新增 post_golang 回覆。
    await PostGolang.create({
      userProfileID,
      replyPostID: postGolang.ID,
      topic: postGolang.topic,
      content: "這是回覆。"
    });

    // 新增 post_nodejs 主題。
    const postNodejs = await PostNodejs.create({
      userProfileID,
      topic: "測試主題001",
      content: "內容..."
    });

    // 新增 post_nodejs 回覆。
    await PostNodejs.create({
      userProfileID,
      replyPostID: postNodejs.ID,
      topic: postNodejs.topic,
      content: "這是回覆。"
    });
  });

  afterEach(async () => {
    await UserProfile.destroy({ where: {} });
    await PostGolang.destroy({ where: {} });
    await PostNodejs.destroy({ where: {} });
  });

  describe("Find topics statistics", () => {
    it("should find successfully", async () => {
      const res = await request(server).get("/api/topics/statistics");
      console.log("res.body", res.body);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        golang: {
          topicCount: 1,
          replyCount: 1,
          lastPostUsername: "test001",
          lastPostTime: expect.any(String)
        },
        nodeJS: {
          topicCount: 1,
          replyCount: 1,
          lastPostUsername: "test001",
          lastPostTime: expect.any(String)
        }
      });
    });
  });

  describe("Find topics", () => {
    it("should find successfully", async () => {
      const res = await request(server)
        .get("/api/topics/golang")
        .query({ offset: 0, limit: 10 });
      console.log("res.body", res.body);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        topics: expect.any(Array),
        totalCount: 1
      });
    });
  });

  describe("Find topic", () => {
    it("should find successfully", async () => {
      const res = await request(server)
        .get("/api/topics/golang/" + postGolang.ID)
        .query({
          offset: 0,
          limit: 10
        });
      console.log("res.body", res.body);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        posts: expect.any(Array),
        totalCount: 2
      });
    });
  });

  describe("Create post", () => {
    it("should create successfully", async () => {
      const requestJSON = {
        userProfileID: 1,
        topic: "測試新增文章",
        content: "測試新增文章"
      };
      const res = await request(server)
        .post("/api/topics/golang")
        .set("Content-Type", "application/json")
        .send(requestJSON);
      console.log("res.body", res.body);
      expect(res.status).toBe(201);
      expect(res.body.post).toMatchObject({
        ID: expect.any(Number),
        userProfileID: 1,
        topic: "測試新增文章",
        content: "測試新增文章",
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
    });
  });
});
