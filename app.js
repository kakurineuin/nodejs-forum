const express = require("express");
require("express-async-errors");
const adminRouter = require("./route/admin");
const authRouter = require("./route/auth");
const topicRouter = require("./route/topic");
const forumRouter = require("./route/forum");
const jwtMiddleware = require("./middleware/jwt");
const adminMiddleware = require("./middleware/admin");
const errorMiddleware = require("./middleware/error");

const app = express();

// TODO: 參考 main.go 加上其他共用的 middleware。

app.use(express.json());
app.use("/api/admin", jwtMiddleware, adminMiddleware, adminRouter);
app.use("/api/auth", authRouter);
app.use("/api/topics", topicRouter);
app.use("/api/forum", forumRouter);

app.use(errorMiddleware);

module.exports = app;
