const User = require("../models/user");
const { comparePassword } = require("../libs/hashPassword");
const { generateToken } = require("../libs/token");
const {
  getRedis,
  storeAttempts,
  blockAuth,
  storeToken,
} = require("../libs/redis");

const authorization = async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ where: { email } });
  if (!existingUser) {
    return res
      .status(409)
      .json({ error: "User with this email is not registered" });
  }
  const redisData = await getRedis(existingUser.id);

  /*if user doesnt have OTP and no confirmed mail (isActive false)*/
  if (!redisData?.otp && !existingUser.isActive) {
    return res.status(409).json({
      error: "To confirm your email, please resend OTP and confirm it",
    });
  }
  if (redisData?.otp && !existingUser.isActive) {
    /*if user have OTP and NO confirmed mail */
    return res.status(409).json({
      error:
        "Firstly user must confirm its email by OTP, that sent to your email",
    });
  }

  const passwordMatch = await comparePassword(password, existingUser.password);
  const attemptsCount = redisData?.attemptsCount || 0;
  const totalAttempts = attemptsCount <= 5;

  if (!passwordMatch && totalAttempts && !redisData?.blocked) {
    if (attemptsCount < 5) {
      await storeAttempts(existingUser.id, attemptsCount + 1);
      return res.status(400).json({
        error: `Invalid password, try again`,
      });
    }
    if (totalAttempts) {
      await blockAuth(existingUser.id);
      return res.status(400).json({
        error: `Authorization blocked for 2 minute, try again later`,
      });
    }
  }
  if (redisData?.blocked) {
    return res.status(400).json({
      error: `Authorization blocked for 2 minute, try again later`,
    });
  }

  if (redisData?.token) {
    return res.status(200).json({
      message: `User already authorized`,
    });
  }
  if (
    !redisData?.otp &&
    existingUser.isActive &&
    attemptsCount < 5 &&
    (await comparePassword(password, existingUser.password))
  ) {
    const authToken = generateToken(64);
    await storeToken(existingUser.id, authToken);
    const redisData = await getRedis(existingUser.id);
    return res.status(200).json({
      message: `User authorized succesfully, your authorization token: ${redisData.token}`,
    });
  }
};
module.exports = authorization;
