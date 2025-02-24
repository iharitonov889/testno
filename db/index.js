const config = require("../config/config");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  config.db.dbName,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: config.db.dialect,
    logging: false,
  }
);
/*export the connection*/
module.exports = sequelize;
