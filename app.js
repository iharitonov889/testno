const config = require("./config/config");
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const userRoutes = require("./routes/userRoutes");
app.use("/", userRoutes);
/*INSTRUCTION*/
/*FIRST: CMD, redis-server,
/*SECOND: terminal, nodemon --env-file=config/.env app.js */
const PORT = config.app.port;
const sequelize = require("./db/index");
app.listen(PORT, async () => {
  console.log("Server: Connection successful");
  await sequelize.sync();
});
