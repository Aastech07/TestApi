const User = require("../models/userModel");
const { generateRefreshToken } = require("../helper/refreshToken");
const { generateToken } = require("../helper/jwt");
const jwt = require("jsonwebtoken");

const userController = {
  signUp: async (req, res) => {
    try {
      const newUser = await User.create(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  loginAdmin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const findAdmin = await User.findOne({ email });

      if (!findAdmin || findAdmin.role !== "admin") {
        throw new Error("Not authorized");
      }

      if (findAdmin && (await findAdmin.isPasswordValid(password))) {
        const refreshToken = await generateRefreshToken(findAdmin?._id);
        const updateAdmin = await User.findByIdAndUpdate(
          findAdmin._id,
          {
            refreshToken: refreshToken,
          },
          { new: true }
        );

        res.cookie(`refreshToken`, refreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({
          _id: findAdmin._id,
          username: findAdmin.username,
          email: findAdmin.email,
          phone: findAdmin.phone,
          role: findAdmin.role,
          token: generateToken(findAdmin._id),
        });
      } else {
        throw new Error("Invalid Credentials");
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const findUser = await User.findOne({ email });

      if (!findUser) {
        return res
          .status(400)
          .json({ message: "Email is not correct Please check" });
      }

      if (!(await findUser.isPasswordValid(password))) {
        return res.status(400).json({
          message: "Password is not correct Please check your password",
        });
      }

      if (findUser.isBlocked) {
        return res
          .status(403)
          .json({ message: "You are temporarily blocked." });
      }

      if (!findUser.isPublished) {
        return res
          .status(403)
          .json({ message: "Your profile is under review." });
      }

      const refreshToken = await generateRefreshToken(findUser?._id);
      const updateUser = await User.findByIdAndUpdate(
        findUser.id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );

      res.cookie(`refreshToken`, refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.json({
        _id: findUser?._id,
        username: findUser?.username,
        email: findUser?.email,
        password: findUser?.password,
        phone: findUser?.phone,
        role: findUser?.role,
        token: generateToken(findUser?._id),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  logout: async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) throw new Error("No Refresh Token in cookies");
    const refreshToken = cookies.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.sendStatus(204);
    }
    await User.findOneAndUpdate(refreshToken, {
      refreshToken: "",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(204);
  },
  handleRefreshToken: async (req, res) => {
    const cookies = req.cookies;
    // console.log(cookies);
    if (!cookies?.refreshToken) throw new Error("No Refresh Token in cookies");
    const refreshToken = cookies.refreshToken;
    // console.log(refreshToken);
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error("No Refresh Token in in db or not matched");
    // res.json(user)
    jwt.verify(refreshToken, process.env.SECRET, (err, decoded) => {
      // console.log(decoded);
      if (err || user.id !== decoded.id) {
        throw new Error("There is something wrong with refresh token");
      }
      const accessToken = generateToken(user?._id);
      res.json({ accessToken });
    });
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().populate("referenceId").exec();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).populate("userId").exec();

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  blockedUser: async (req, res) => {
    const { id } = req.params;
    try {
      const blockUser = await User.findByIdAndUpdate(
        id,
        {
          isBlocked: true,
        },
        {
          new: true,
        }
      );

      if (!blockUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User blocked successfully", user: blockUser });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
  unblockUser: async (req, res) => {
    const { id } = req.params;

    try {
      const unblockUser = await User.findByIdAndUpdate(
        id,
        {
          isBlocked: false,
        },
        {
          new: true,
        }
      );

      if (!unblockUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User Unblocked successfully", user: unblockUser });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
  updateUserById: async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteUserById: async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);

      if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  approveuser: async (req, res) => {
    try {
      const { userId } = req.params;

      if (req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Unauthorized to approve users" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Matrimonial not found" });
      }

      user.isApproved = true;
      user.isPublic = true;
      await user.save();

      res
        .status(200)
        .json({ message: "Matrimonial approved successfully", user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  searchUser: async (req, res) => {
    try {
      const { email, phone, username } = req.query;

      if (!email && !phone && !username) {
        return res.status(400).json({
          message:
            "Please provide either email, phone, or username for the search.",
        });
      }

      let searchCriteria = {};
      if (email) {
        searchCriteria.email = email;
      }
      if (phone) {
        searchCriteria.phone = phone;
      }
      if (username) {
        searchCriteria.username = username;
      }

      const foundUser = await User.findOne(searchCriteria);
      if (!foundUser) {
        return res.status(404).json({ message: "User not found." });
      }

      return res.json({
        _id: foundUser._id,
        username: foundUser.username,
        email: foundUser.email,
        phone: foundUser.phone,
        role: foundUser.role,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
module.exports = userController;
