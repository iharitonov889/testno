const User = require("../models/user");
const { delRedis, storeActivation, getRedis } = require("../libs/redis");

const confirmOtp = async (req, res) => {
  const { clientId, clientOtp } = req.body;
  const redisOtp = await getRedis(clientId);

  const existingUser = await User.findOne({ where: { id: clientId } });
  if (!existingUser)
    return res
      .status(404)
      .json({ error: "User not found, please check your ID" });
  if (redisOtp === null) {
    return res.status(404).json({
      error: "To confirm your email, please resend OTP code",
    });
  }
  if (clientOtp != redisOtp.otp && !existingUser.isActive)
    return res.status(404).json({
      error: "Error in OTP input, please check your OTP and try again",
    });
  if (existingUser.isActive == true) {
    return res.status(201).json({
      message: "Congratulations, your email already confirmed",
    });
  }

  if (clientOtp == redisOtp.otp && existingUser.isActive == false) {
    /*make new redis after activation*/

    /*await storeActivation(clientId);*/
    await delRedis(clientId);
    existingUser.isActive = true;
    await existingUser.save();
    return res.status(202).json({
      message: "Congratulations, you confirmed your email ",
    });
  }
};

module.exports = confirmOtp;
