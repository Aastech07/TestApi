const mongoose = require("mongoose");

const userSchemaV1 = new mongoose.Schema({
  relationship: {
    type: String,
    enum: ["Father", "Mother", "Daughter", "Son", "other"],
    required: true,
  },
  membershipId: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    unique: true,
    required: true,
    minlength: 10,
  },
  otp: {
    type: String,
  },
  otpExpiration: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserV1 = mongoose.model("UserV1", userSchemaV1);

module.exports = UserV1;
