const mongoose = require("mongoose");

const generateNumericId = () => {
  const digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let numericId = "";

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    numericId += digits.charAt(randomIndex);
  }

  return numericId;
};

const individualSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  gender: { type: String, required: true },
  dateOfBirth: { type: Date },
  image: { type: String },
  membershipId: { type: String, unique: true, default: generateNumericId },
});

const Individual = mongoose.model("Individual", individualSchema);

module.exports = { Individual };

