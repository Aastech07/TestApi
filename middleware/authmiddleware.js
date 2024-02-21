const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const authmiddleware = asyncHandler(async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else {
      throw new Error("There is no token attached to the headers");
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new Error("User not found");
      }
      req.user = user;
      next();
    } else {
      throw new Error("Invalid token");
    }
  } catch (error) {
    next(error);
  }
});
const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email }).exec();
  if (!adminUser || adminUser.role !== "admin") {
    return res.status(403).json({ error: "You are not an admin" });
  }
  next();
});
const AproveAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email }).exec();

  if (!adminUser || adminUser.role !== "admin") {
    return res.status(403).json({ error: "Sorry You are not authorized approved" });
  }

  next();
});
module.exports = { authmiddleware, isAdmin, AproveAdmin };
