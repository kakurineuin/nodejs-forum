module.exports = function(req, res, next) {
  const user = req.user;

  // 若未登入或不是系統管理員。
  if (!user || user.role !== "admin") {
    return res.status(403).json({
      message: "權限不足。"
    });
  }

  next();
};
