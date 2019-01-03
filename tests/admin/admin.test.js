const request = require("supertest");
const sequelize = require("../../database/database");
const UserProfile = require("../../model/user_profile");
const app = require("../../app");

describe("Admin Handler", () => {
  let userID = null;

  beforeEach(async () => {
    await sequelize.sync();

    // 新增 5 名使用者。
    for (let i = 0; i < 5; i++) {
      const number = i + 1;
      const user = await UserProfile.create({
        username: "test00" + number,
        email: "test00" + number + "@xxx.com",
        password:
          "$2a$10$041tGlbd86T90uNSGbvkw.tSExCrlKmy37QoUGl23mfW7YGJjUVjO",
        role: "user"
      });

      if (i === 4) {
        userID = user.id;
      }
    }
  });

  afterEach(async () => {
    await UserProfile.destroy({ where: {} });
  });

  describe("Find users", () => {
    it("should find successfully", async () => {
      const res = await request(app)
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
      const res = await request(app).post("/api/admin/users/disable/" + userID);
      console.log("res.body", res.body);
      expect(res.status).toBe(200);
      expect(res.body.user).not.toBeNull();
    });
  });
});
