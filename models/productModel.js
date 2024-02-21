const mongoose = require("mongoose");

const phoneSchema = new mongoose.Schema({
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  brand: {
    type: String,
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
  address: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    required: true,
  },
  images: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});
const accessoriesSchema = new mongoose.Schema({
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  type: {
    type: String,
    enum: ["Mobile", "Tablet"],
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
  address: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    required: true,
  },
  images: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});
const tabletsSchema = new mongoose.Schema({
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  type: {
    type: String,
    enum: ["iPads", "Samsung", "Other Tablets"],
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
  address: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});
const bicyclesSchema = new mongoose.Schema({
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  brand: {
    type: String,
    enum: ["Hercules", "Hero", "Other Brands"],
    required: true,
  },
  adTitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
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
  images: {
    type: [String],
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});
const bikeSchema = new mongoose.Schema({
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
  },
  number: {
    type: Number,
  },
  kmDriven: {
    type: Number,
    required: true,
  },
  numberOfOwners: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4, "4+"],
  },
  adTitle: {
    type: String,
    enum: ["Bike", "Scooter"],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
  },
  address: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});
const carSchema = new mongoose.Schema({
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  fuelType: {
    type: String,
    enum: ["CNG & Hybrids", "Diesel", "Electric", "LPG", "Petrol"],
    required: true,
  },
  transmission: {
    type: String,
    enum: ["Automatic", "Manual"],
    required: true,
  },
  kmDriven: {
    type: Number,
    required: true,
  },
  numberOfOwners: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4, "4+"],
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
  address: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

const Phone = mongoose.model("Phone", phoneSchema);
const Accessories = mongoose.model("Accessories", accessoriesSchema);
const Tablets = mongoose.model("Tablets", tabletsSchema);
const Bicycles = mongoose.model("Bicycles", bicyclesSchema);
const Bike = mongoose.model("Bike", bikeSchema);
const Car = mongoose.model("Car", carSchema);

module.exports = {
  Phone,
  Accessories,
  Tablets,
  Bicycles,
  Bike,
  Car,
};
