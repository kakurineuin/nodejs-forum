const request = require("supertest");
const sequelize = require("../../database/database");
const UserProfile = require("../../model/user_profile");
const PostGolang = require("../../model/post_golang");
const PostNodejs = require("../../model/post_nodejs");
const createToken = require("../createToken");
const app = require("../../app");

describe("Topic Handler", () => {
  let userProfileId = null;
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
    userProfileId = userProfile.id;

    // 新增 post_golang 主題。
    postGolang = await PostGolang.create({
      userProfileId,
      topic: "測試主題001",
      content: "內容..."
    });

    // 新增 post_golang 回覆。
    await PostGolang.create({
      userProfileId,
      replyPostId: postGolang.id,
      topic: postGolang.topic,
      content: "這是回覆。"
    });

    // 新增 post_nodejs 主題。
    const postNodejs = await PostNodejs.create({
      userProfileId,
      topic: "測試主題001",
      content: "內容..."
    });

    // 新增 post_nodejs 回覆。
    await PostNodejs.create({
      userProfileId,
      replyPostId: postNodejs.id,
      topic: postNodejs.topic,
      content: "這是回覆。"
    });
  });

  afterEach(async () => {
    await UserProfile.destroy({ where: {} });
    await PostGolang.destroy({ where: {}, force: true });
    await PostNodejs.destroy({ where: {}, force: true });
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
        .get("/api/topics/golang/" + postGolang.id)
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
        userProfileId,
        topic: "測試新增文章",
        content: "測試新增文章"
      };
      const res = await request(server)
        .post("/api/topics/golang")
        .set("Authorization", "Bearer " + createToken(userProfileId))
        .set("Content-Type", "application/json")
        .send(requestJSON);
      console.log("res.body", res.body);
      expect(res.status).toBe(201);
      expect(res.body.post).toMatchObject({
        id: expect.any(Number),
        userProfileId,
        topic: "測試新增文章",
        content: "測試新增文章",
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
    });
  });

  describe("Update post", () => {
    it("should update successfully", async () => {
      const requestJSON = {
        content: "測試修改文章"
      };
      const res = await request(server)
        .put("/api/topics/golang/" + postGolang.id)
        .set("Authorization", "Bearer " + createToken(userProfileId))
        .set("Content-Type", "application/json")
        .send(requestJSON);
      console.log("res.body", res.body);
      expect(res.status).toBe(200);
      expect(res.body.post).toMatchObject({
        id: postGolang.id,
        userProfileId: postGolang.userProfileId,
        topic: postGolang.topic,
        content: requestJSON.content,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
    });
  });

  describe("Delete post", () => {
    it("should delete successfully", async () => {
      const res = await request(server)
        .delete("/api/topics/golang/" + postGolang.id)
        .set("Authorization", "Bearer " + createToken(userProfileId));
      console.log("res.body", res.body);
      expect(res.status).toBe(200);
      expect(res.body.post).toMatchObject({
        id: postGolang.id,
        userProfileId: postGolang.userProfileId,
        topic: postGolang.topic,
        content: "此篇文章已被刪除。",
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        deletedAt: expect.any(String)
      });
    });
  });
});
