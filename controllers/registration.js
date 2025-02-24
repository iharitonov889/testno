const User = require("../models/user");
const { generateOtp } = require("../libs/otp");
const sendOtp = require("./otpMail");
const { storeOtp } = require("../libs/redis");

const { hashPassword } = require("../libs/hashPassword");

const emailRegex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  if (!emailRegex.test(email)) {
    return res.status(401).json({
      error:
        "The email can contain only latin characters or digits, and special letter '@'",
    });
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser)
    return res
      .status(409)
      .json({ error: "User with this email already registered" });

  if (!passwordRegex.test(password)) {
    return res.status(422).json({
      error:
        "The password must contain at least 8 characters long, uppercase and lowercase latin letter, digit and a special character",
    });
  }

  if (emailRegex.test(email) && passwordRegex.test(password)) {
    const hashedPassword = await hashPassword(password);
    /*better "create" AFTER OTP-confirmation but ok (need userId randomgen*/
    await User.create({ email, password: hashedPassword });
    const otp = generateOtp(); /*generate code*/
    await sendOtp(email, otp); /*mail the code*/

    const userId = await User.findOne({ where: { email } });
    storeOtp(userId.id, otp); /*unite the user with his OTP*/
    return res.status(201).json({
      message: `Congratulations on successful registration, your ID: ${userId.id}, now confirm your OTP, that sent to your email`,
    });
  }
};

module.exports = registerUser;
