const express = require("express");
const router = express.Router();

const registerUser = require("../controllers/registration");
router.post("/registration", registerUser);

const confirmOtp = require("../controllers/confirmOtp");
router.post("/confirmOtp", confirmOtp);

const resendOtp = require("../controllers/resendOtp");
router.post("/resendOtp", resendOtp);

const authorization = require("../controllers/authorization");
router.post("/authorization", authorization);

const resetPassword = require("../controllers/resetPassword");
router.post("/resetPassword", resetPassword);

const logout = require("../controllers/logout");
router.post("/logout", logout);

module.exports = router;
