const express = require("express");
const router = express.Router();
const UserController = require("../controller/userController");
const authController = require("../helper/sendmail");
const {
  authmiddleware,
  AproveAdmin,
  isAdmin,
} = require("../middleware/authmiddleware");

router.post("/signup", UserController.signUp);
router.post("/login", UserController.login);
router.get("/getUserbyId/:id", UserController.getUserById);
router.get("/searchUser", UserController.searchUser);
router.post("/updateUser/:id", UserController.updateUserById);
router.put("/blockedUser/:id", UserController.blockedUser);
router.put("/unblockUser/:id", UserController.unblockUser);
router.delete("/deleteUser/:id", UserController.deleteUserById);
router.get("/getAllUser", UserController.getAllUsers);
router.post("/admin-login", UserController.loginAdmin);
router.get("/admin-logout", UserController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.put(
  "/user/approve/:userId",
  authmiddleware,
  AproveAdmin,
  isAdmin,
  UserController.approveuser
);

router.get("/refresh", UserController.handleRefreshToken);

module.exports = router;
