const Member = require("../models/memberModel");
const User = require("../models/userV1Model");
const ITEMS_PER_PAGE = 10;
const AWS = require("aws-sdk");
const fs = require("fs");

const uploadImage = async (file) => {
  const bucketName = process.env.AWS_BUCKET_NAME;
  const region = "AP-SOUTH-1";
  const accessKeyId = process.env.AWS_ACCESS_KEY;
  const secretAccessKey = process.env.AWS_SECRET_KEY;

  const s3 = new AWS.S3({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region,
  });

  const fileName = `Member/${file.originalname}`;

  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(file.path);

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: fileStream,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading to S3:", err);
        reject(err);
      }
      console.log("S3 Upload Data:", data);
      resolve(data.Location);
    });
  });
};

const uploadMemberImage = async (req, res) => {
  try {
    const file = req.file;
    const image = await uploadImage(file);
    const updateData = { ...req.body, image };

    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json(updatedMember);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getMembersPage = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const totalMembers = await Member.countDocuments();
    const totalPages = Math.ceil(totalMembers / ITEMS_PER_PAGE);

    const members = await Member.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .populate("profileId");

    res.status(200).json({
      members,
      currentPage: page,
      totalPages,
      totalMembers,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchMembers = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const members = await Member.find({
      $or: [{ fullname: { $regex: searchTerm, $options: "i" } }],
    }).populate("profileId");

    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMember = async (req, res) => {
  try {
    const newMember = new Member(req.body);
    const saveMember = await newMember.save();
    res.status(201).json(saveMember);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getMembers = async (req, res) => {
  try {
    const members = await Member.find()
      .populate("profileId")
      .populate("userId");
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const GetAllMyMember = async (req, res) => {
  try {
    const UserId = req.body.UserId;

    if (!UserId) {
      return res
        .status(400)
        .json({ error: "UserId is required in the request body." });
    }

    const members = await Member.find({ userId: UserId }).select(
      "-createdAt -userId -_id -__v"
    );

    if (members.length === 0) {
      return res
        .status(404)
        .json({ message: `No members found for the given userId: ${UserId}.` });
    }

    return res.status(200).json(members);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).populate("profileId");

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMemberById = async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMemberById = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  GetAllMyMember,
  createMember,
  uploadMemberImage,
  getMembers,
  getMemberById,
  updateMemberById,
  deleteMemberById,
  getMembersPage,
  searchMembers,
};
