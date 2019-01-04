const express = require("express");
const adminRouter = require("./route/admin");
const authRouter = require("./route/auth");

const app = express();

// TODO: 參考 main.go 加上其他共用的 middleware。
// TODO: 實作 CustomError 的錯誤處理。

app.use(express.json());
app.use("/api/admin", adminRouter);
app.use("/api/auth", authRouter);

module.exports = app;
