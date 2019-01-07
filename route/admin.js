const express = require("express");
const AdminService = require("../service/AdminService");

const adminService = new AdminService();
const router = express.Router();

/**
 * 查詢使用者。
 */
router.get("/users", async (req, res) => {
  const result = await adminService.findUsers(
    req.query.searchUser,
    parseInt(req.query.offset, 10),
    parseInt(req.query.limit, 10)
  );
  res.status(200).json({
    users: result.rows,
    totalCount: result.count
  });
});

/**
 * 停用使用者。
 */
router.post("/users/disable/:id", async (req, res) => {
  const userProfile = await adminService.disableUser(req.params.id);
  res.status(200).json({
    message: "停用使用者成功。",
    user: userProfile
  });
});

module.exports = router;
