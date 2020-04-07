const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { getVerificationNumber } = require("../utils/utils");

const newUserAuth = async (req, res, next) => {
  debugger;
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    debugger;
    if (user && user.verifiedAccount) {
      throw new Error();
    }
    req.body.verificationNumber = getVerificationNumber();
    if (user && user.verifiedAccount === false) {
      await User.remove();
      console.log("unverified user deleted.");
    }
    next();
  } catch (error) {
    res.status(400).send("Email already exists.");
  }
};

const auth = async (req, res, next) => {
  try {
    const token = req.header("authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
      verifiedAccount: true,
    });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({
      error: "Please authenticate.",
    });
  }
};

module.exports = {
  auth,
  newUserAuth,
};
