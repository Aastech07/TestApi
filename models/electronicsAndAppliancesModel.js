const mongoose = require("mongoose");

const electronicsSchema = new mongoose.Schema({
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  electronicsAndAppliances: {
    type: String,
    enum: [
      "TVs, Video - Audio",
      "Kitchen & Other Appliances",
      "Computers & Laptops",
      "Cameras & Lenses",
      "Games & Entertainment",
      "Fridges",
      "Computer Accessories",
      "Hard Disks, Printers & Monitors",
      "ACs",
      "Washing Machines",
      "other",
    ],
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    required: true,
  },
  used: {
    type: String,
    enum: ["New", "Old"],
    required: true,
  },
  adTitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: [{ type: String }],
  isActive: {
    type: Boolean,
    default: false,
  },
});

const Electronics = mongoose.model("Electronics", electronicsSchema);

module.exports = Electronics;
