const config = require("../config/config");
const redis = require("redis");

const redisClient = redis.createClient({
  host: config.redis.host,
  port: config.redis.port,
});

redisClient.on("connect", () => console.log("Redis: Connection successful"));
redisClient.on("error", () => console.log("Redis: An error occurred"));
redisClient.connect();

const storeOtp = async (id, otp) => {
  const k = `id:${id}`;
  const v = JSON.stringify({ otp });
  await redisClient.set(k, v, { EX: 60 * 10 });
};
const storeActivation = async (id) => {
  const k = `id:${id}`;
  const active = true;
  const v = JSON.stringify({ active });
  await redisClient.set(k, v);
};
const storeAttempts = async (id, attemptsCount) => {
  const k = `id:${id}`; /* id.toString()*/
  /*const v = attempsCount.toString();*/
  const v = JSON.stringify({ attemptsCount });
  await redisClient.set(k, v);
};
const blockAuth = async (id) => {
  const k = `id:${id}`;
  const blocked = true;
  const v = JSON.stringify({ blocked });
  await redisClient.set(k, v, { EX: 60 * 2 });
};
const storeToken = async (id, token) => {
  const k = `id:${id}`;
  const v = JSON.stringify({ token });
  await redisClient.set(k, v, { EX: 60 * 60 });
};
const storeReset = async (id) => {
  const k = `id:${id}`;
  const resetPassword = true;
  const v = JSON.stringify({ resetPassword });
  await redisClient.set(k, v);
};

const getRedis = async (id) => {
  const k = `id:${id}`;
  const v = await redisClient.get(k);
  const parsedV = JSON.parse(v);
  return parsedV;
};

const delRedis = async (id) => {
  const k = `id:${id}`;
  await redisClient.del(k);
};

module.exports = {
  storeOtp,
  storeActivation,
  storeAttempts,
  blockAuth,
  storeToken,
  storeReset,
  getRedis,
  delRedis,
};
