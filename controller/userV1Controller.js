const UserV1 = require("../models/userV1Model");
const Profile = require("../models/profileModel");
const { Individual } = require("../models/familyTreeModel");
const generateOTP = () => {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expirationTime = new Date().getTime() + 60 * 1000;
  return { otp, expirationTime };
};

const sendOTP = (phone, otp) => {
  console.log(`Sending OTP ${otp.otp} to ${phone} via SMS`);
};

const signup = async (req, res) => {
  try {
    const { phone, relationship, membershipId } = req.body;
    const existingUserWithPhone = await UserV1.findOne({ phone });

    if (existingUserWithPhone) {
      return res
        .status(400)
        .json({ error: "User with this phone number already exists" });
    }

    const existingUserWithMembershipId = await Individual.findOne({
      membershipId,
    });

    if (!existingUserWithMembershipId) {
      return res.status(400).json({
        error: "User membershipid is not correct please check and try again",
      });
    }

    const { otp, expirationTime } = generateOTP();

    const newUser = new UserV1({
      phone,
      relationship,
      membershipId,
      otp,
      otpExpiration: expirationTime,
    });

    await newUser.save();

    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    if (error.name === "MongoError" && error.code === 11000) {
      return res
        .status(400)
        .json({ error: "User with this phone number already exists" });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { phone } = req.body;

    const { otp, expirationTime } = generateOTP();

    console.log(`Generated OTP for ${phone}: ${otp}`);

    sendOTP(phone, otp);

    await UserV1.updateOne(
      { phone },
      { $set: { otp, otpExpiration: expirationTime } }
    );

    return res.status(200).json({ message: "OTP sent successfully", otp });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const user = await UserV1.findOne({ phone });

    if (
      !user ||
      !user.otp ||
      typeof user.otp !== "string" ||
      typeof otp !== "string" ||
      user.otp.trim() !== otp.trim() ||
      new Date().getTime() > user.otpExpiration
    ) {
      return res.status(401).json({ error: "Invalid OTP" });
    }
    await UserV1.updateOne({ phone }, { $unset: { otp: 1, otpExpiration: 1 } });
    const userProfile = await Profile.findOne({ userId: user._id });
    return res
      .status(200)
      .json({ message: "Login successful", user, userProfile });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await UserV1.find();
    const userProfilePromises = users.map(async (user) => {
      return await Profile.findOne({ userId: user._id });
    });

    const userProfiles = await Promise.all(userProfilePromises);

    return res.status(200).json({ users, userProfiles });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const findById = async (req, res) => {
  try {
    const user = await UserV1.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userProfile = await Profile.findOne({ userId: user._id });

    res.status(200).json({ user, userProfile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  signup,
  login,
  verifyOTP,
  getAllUsers,
  findById,
};
