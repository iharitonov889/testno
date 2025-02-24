const User = require("../models/user");
const { generateOtp } = require("../libs/otp");
const sendOtp = require("./otpMail");
const { getRedis, storeOtp } = require("../libs/redis");

const resendOtp = async (req, res) => {
  const { id } = req.body;
  const existingUser = await User.findOne({ where: { id } });
  if (!existingUser)
    return res
      .status(404)
      .json({ error: "User not found, please check your ID and try again" });

  const redisData = await getRedis(id); /*otp OR active*/

  if (redisData?.token) {
    return res.status(404).json({ error: "Error, user authorized" });
  }

  if (!redisData) {
    const otp = generateOtp(); /*generate code*/
    await sendOtp(existingUser.email, otp); /*mail the code*/

    storeOtp(id, otp); /*unite the user with his OTP*/
    return res.status(201).json({
      message: `Now confirm your OTP, that send to your email`,
    });
  }
  if (existingUser.isActive == true) {
    const otp = generateOtp(); /*generate code*/
    await sendOtp(existingUser.email, otp); /*mail the code*/

    storeOtp(id, otp); /*unite the user with his OTP*/
    return res.status(201).json({
      message: `Now you can change your password`,
    });
  }

  if (redisData.otp) {
    return res.status(409).json({
      error: "Check your email for OTP code",
    });
  }
};
module.exports = resendOtp;
/*  if (existingUser.isActive == true) {
    return res.status(201).json({
      message: "Congratulations, your email already activated",
    });
  }*/
