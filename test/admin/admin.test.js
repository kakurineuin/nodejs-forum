const request = require("supertest");
const sequelize = require("../../database/database");
const UserProfile = require("../../model/user_profile");
const app = require("../../app");

describe("Admin Handler", () => {
  let server = null;
  let userId = null;

  beforeAll(async () => {
    await sequelize.sync();
    server = app.listen(3000);
  });

  afterAll(async () => {
    server.close();
  });

  beforeEach(async () => {
    // 新增 5 名使用者。
    for (let i = 0; i < 5; i++) {
      const number = i + 1;
      const userProfile = await UserProfile.create({
        username: "test00" + number,
        email: "test00" + number + "@xxx.com",
        password:
          "$2a$10$041tGlbd86T90uNSGbvkw.tSExCrlKmy37QoUGl23mfW7YGJjUVjO",
        role: "user"
      });

      if (i === 4) {
        userId = userProfile.id;
      }
    }
  });

  afterEach(async () => {
    await UserProfile.destroy({ where: {} });
  });

  describe("Find users", () => {
    it("should find successfully", async () => {
      const res = await request(server)
        .get("/api/admin/users")
        .query({ offset: 0, limit: 10 });
      console.log("res.body", res.body);
      expect(res.status).toBe(200);
      expect(res.body.users).toHaveLength(5);
      expect(res.body.totalCount).toBe(5);
    });
  });

  describe("Disable users", () => {
    it("should disable user successfully", async () => {
      const res = await request(server).post(
        "/api/admin/users/disable/" + userId
      );
      console.log("res.body", res.body);
      expect(res.status).toBe(200);
      expect(res.body.user).toMatchObject({
        id: expect.any(Number),
        username: "test005",
        email: "test005@xxx.com",
        role: "user",
        isDisabled: 1,
        createdAt: expect.any(String)
      });
    });
  });
});
