const request = require("supertest");
const sequelize = require("../../database/database");
const bcrypt = require("bcrypt");
const UserProfile = require("../../model/user_profile");
const app = require("../../app");

describe("Auth Handler", () => {
  let server = null;

  beforeAll(async () => {
    await sequelize.sync();
    server = app.listen(3000);
  });

  afterAll(async () => {
    server.close();
  });

  beforeEach(async () => {
    await UserProfile.create({
      username: "test001",
      email: "test001@xxx.com",
      password: "$2a$10$041tGlbd86T90uNSGbvkw.tSExCrlKmy37QoUGl23mfW7YGJjUVjO",
      role: "user"
    });
  });

  afterEach(async () => {
    await UserProfile.destroy({ where: {} });
  });

  describe("Register", () => {
    it("should fail to register if some parameters are missing", async () => {
      const requestJSON = {};
      const res = await request(server)
        .post("/api/auth/register")
        .set("Content-Type", "application/json")
        .send(requestJSON);
      console.log("res.body", res.body);
      expect(res.status).toBe(400);
    });
    it("should register successfully", async () => {
      const requestJSON = {
        username: "test002",
        email: "test002@xxx.com",
        password: "test123"
      };
      const res = await request(server)
        .post("/api/auth/register")
        .set("Content-Type", "application/json")
        .send(requestJSON);
      console.log("res.body", res.body);
      expect(res.status).toBe(200);
      expect(res.body.token).not.toBeNull();
      expect(res.body.exp).toBeGreaterThan(1);
      expect(res.body.userProfile).toMatchObject({
        ID: expect.any(Number),
        username: "test002",
        email: "test002@xxx.com",
        password: "",
        role: "user",
        isDisabled: 0,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
    });
  });

  describe("Login", () => {
    it("should login successfully", async () => {
      const requestJSON = {
        email: "test001@xxx.com",
        password: "test123"
      };
      const res = await request(server)
        .post("/api/auth/login")
        .set("Content-Type", "application/json")
        .send(requestJSON);
      console.log("res.body", res.body);
      expect(res.status).toBe(200);
      expect(res.body.token).not.toBeNull();
      expect(res.body.exp).toBeGreaterThan(1);
      expect(res.body.userProfile).toMatchObject({
        ID: expect.any(Number),
        username: "test001",
        email: "test001@xxx.com",
        password: "",
        role: "user",
        isDisabled: 0,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
    });
  });
});
