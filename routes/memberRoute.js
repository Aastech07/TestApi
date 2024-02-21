const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const memberController = require("../controller/memberController");

router.get("/members", memberController.getMembersPage);
router.get("/GetAllMyMember", memberController.GetAllMyMember);
router.get("/members/search", memberController.searchMembers);
router.post("/members", memberController.createMember);
router.get("/members/all", memberController.getMembers);
router.get("/getAllMember/:id", memberController.getMembers);
router.get("/members/:id", memberController.getMemberById);
router.put("/members/:id", memberController.updateMemberById);
router.delete("/members/:id", memberController.deleteMemberById);

router.post(
  "/uploadImage/member/:id",
  upload.single("image"),
  memberController.uploadMemberImage
);
module.exports = router;
