const express = require("express");
const adminRouter = require("./route/admin");

const app = express();

app.use(express.json());
app.use("/api/admin", adminRouter);

module.exports = app;
