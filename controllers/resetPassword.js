const User = require("../models/user");
const { getRedis, delRedis } = require("../libs/redis");
const { hashPassword } = require("../libs/hashPassword");

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const existingUser = await User.findOne({ where: { email } });
  if (!existingUser) {
    return res
      .status(404)
      .json({ error: "User not found, please check your email and try again" });
  }
  const redisData = await getRedis(existingUser.id);

  if (redisData?.token) {
    return res.status(302).json({ error: "Error, user authorized" });
  }
  if (!redisData?.otp) {
    return res.status(404).json({
      error: "Error, to change password you must get OTP code first",
    });
  }
  /*To change password, resendOTP*/
  if (existingUser.isActive && redisData?.otp == otp && newPassword) {
    await delRedis(existingUser.id);
    const hashedPassword = await hashPassword(newPassword);
    existingUser.password = hashedPassword;
    await existingUser.save();
    return res.status(200).json({ message: "Password changed" });
  }
  if (redisData?.otp != otp) {
    return res
      .status(400)
      .json({ errror: "Invalid OTP, please check and try again" });
  }
};
module.exports = resetPassword;
