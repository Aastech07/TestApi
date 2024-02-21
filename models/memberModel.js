const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserV1",
    required: true,
  },
  Relationship: {
    type: String,
    enum: [
      "Father",
      "Mother",
      "Son",
      "Daughter",
      "Grandfather",
      "Grandmother",
      "Uncle",
      "Aunt",
      "Brother",
      "Cousin",
      "Nephew",
      "Niece",
      "Husband",
      "Wife",
      "Godfather",
      "Godmother",
    ],
    required: true,
  },
  fullname: {
    type: String,
  },
  image: {
    type: String,
  },
 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;
