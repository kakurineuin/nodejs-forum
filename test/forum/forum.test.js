const request = require("supertest");
const sequelize = require("../../database/database");
const UserProfile = require("../../model/userProfile");
const PostGolang = require("../../model/postGolang");
const PostNodejs = require("../../model/postNodejs");
const app = require("../../app");

describe("Forum Handler", () => {
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

  describe("Find forum statistics", () => {
    it("should find successfully", async () => {
      const res = await request(server).get("/api/forum/statistics");
      console.log("res.body", res.body);
      expect(res.status).toBe(200);
      expect(res.body.forumStatistics).toMatchObject({
        topicCount: expect.any(Number),
        replyCount: expect.any(Number),
        userCount: expect.any(Number)
      });
    });
  });
});
