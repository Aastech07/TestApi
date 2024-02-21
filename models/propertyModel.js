const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  propertyFor: {
    type: String,
    enum: [
      "For Sale: Houses & Apartments",
      "For Rent: Houses & Apartments",
      "other",
    ],
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  ContactNo: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    required: true,
  },
  proprietorshiptypes: {
    type: String,
    enum: ["Ownership", "Pagdi"],
  },
  propertyType: {
    type: String,
    enum: ["Apartments", "Builder Floors", "Farm Houses", "Houses & Villas"],
    required: true,
  },
  bedrooms: {
    type: Number,
    enum: [0, 1, 2, 3, "3+"],
    required: true,
  },
  bathrooms: {
    type: Number,
    enum: [0, 1, 2, 3, "3+"],
    required: true,
  },
  furnishing: {
    type: String,
    enum: ["Furnished", "Semi-Furnished", "Unfurnished"],
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
  maintenanceMonthly: {
    type: Number,
  },
  totalFloors: {
    type: Number,
  },
  floorNo: {
    type: Number,
  },
  carParking: {
    type: Number,
    enum: [0, 1, 2, 3, "3+"],
  },
  facing: {
    type: String,
    enum: [
      "East",
      "North",
      "North-East",
      "North-West",
      "South",
      "South-East",
      "South-West",
      "West",
    ],
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
  image: {
    type: [String],
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
