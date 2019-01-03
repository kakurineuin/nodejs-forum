const express = require("express");
const adminRouter = require("./route/admin");

const app = express();

// TODO: 參考 main.go 加上其他共用的 middleware。

app.use(express.json());
app.use("/api/admin", adminRouter);

module.exports = app;
