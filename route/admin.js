const express = require("express");
const AdminService = require("../service/admin");

const adminService = new AdminService();
const router = express.Router();

router.get("/users", async (req, res) => {
  const result = await adminService.findUsers(
    req.query.searchUser,
    req.query.offset,
    req.query.limit
  );
  return res.status(200).json({
    users: result.rows,
    totalCount: result.count
  });
});

module.exports = router;
