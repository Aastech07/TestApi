const mongoose = require("mongoose");

const shopOfficeSchema = new mongoose.Schema({
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  furnishing: {
    type: String,
    enum: ["Furnished", "Semi-Furnished", "Unfurnished"],
    required: true,
  },
  shopOfficeType: {
    type: String,
    enum: ["For Rent: Shops & Offices", "For Sale: Shops & Offices", "Other"],
    required: true,
  },
  superBuiltupArea: {
    type: Number,
    required: true,
  },
  carpetArea: {
    type: Number,
    required: true,
  },
  maintenance: {
    type: Number,
  },
  carParking: {
    type: Number,
    enum: [0, 1, 2, 3, "3+"],
  },
  washrooms: {
    type: Number,
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
  address: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  facilities: {
    wifi: Boolean,
    ac: Boolean,
    tv: Boolean,
    refrigerator: Boolean,
    security: Boolean,
  },
  images: [{ type: String }],
  isActive: {
    type: Boolean,
    default: false,
  },
});

const ShopOffice = mongoose.model("ShopOffice", shopOfficeSchema);

module.exports = ShopOffice;
