const User = require("../models/user");
const { getRedis, delRedis } = require("../libs/redis");
const logout = async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ where: { email } });
  if (!existingUser) {
    return res.status(409).json({ error: "Internal error" });
  } /*User with this email is not registered*/

  const redisData = await getRedis(existingUser.id);

  if (redisData?.token) {
    await delRedis(existingUser.id);
    return res.status(200).json({
      error: "User logged out successfuly",
    });
  }
  if (!redisData?.token) {
    /*if null*/
    return res.status(200).json({
      error: "User must authorize first",
    });
  }
};
module.exports = logout;
