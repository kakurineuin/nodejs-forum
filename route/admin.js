const express = require("express");
const AdminService = require("../service/admin");

const adminService = new AdminService();
const router = express.Router();

router.get("/users", async (req, res) => {
  const result = await adminService.findUsers(
    req.query.searchUser,
    parseInt(req.query.offset, 10),
    parseInt(req.query.limit, 10)
  );
  return res.status(200).json({
    users: result.rows,
    totalCount: result.count
  });
});

router.post("/users/disable/:id", async (req, res) => {
  const userProfile = await adminService.disableUser(req.params.id);
  return res.status(200).json({
    message: "停用使用者成功。",
    user: userProfile
  });
});

module.exports = router;
