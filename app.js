const path = require("path");
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

app.use(express.static("frontend/build"));
app.use(express.json());
app.use("/api/admin", jwtMiddleware, adminMiddleware, adminRouter);
app.use("/api/auth", authRouter);
app.use("/api/topics", topicRouter);
app.use("/api/forum", forumRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./frontend/build/index.html"));
});

app.use(errorMiddleware);

module.exports = app;
