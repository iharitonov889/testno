require("dotenv").config();

module.exports = {
  app: {
    port: process.env.PORT,
  },
  db: {
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,

    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  mail: {
    service: process.env.MAIL_SERVICE,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
  },
};
