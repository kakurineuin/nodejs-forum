const sequelize = require("./database/database");
const app = require("./app");

sequelize
  .sync()
  .then(result => {
    console.log("sequelize sync result", result);
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
