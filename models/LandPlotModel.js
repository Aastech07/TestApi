const mongoose = require("mongoose");

const landPlotSchema = new mongoose.Schema({
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  type: {
    type: String,
    enum: ["For Rent", "For Sale"],
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
  superBuiltupArea: {
    type: Number,
    required: true,
  },
  carpetArea: {
    type: Number,
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
  facilities: {
    type: {
      electricity: Boolean,
      waterSupply: Boolean,
      gasPipeline: Boolean,
      roadAccess: Boolean,
      streetLighting: Boolean,
      parking: Boolean,
      garden: Boolean,
      gym: Boolean,
      playground: Boolean,
      nearbySchools: Boolean,
      nearbyHospitals: Boolean,
      nearbyPublicTransport: Boolean,
    },
    default: {},
  },
  images: [{ type: String }],
  document: [{ type: String }],
  isActive: {
    type: Boolean,
    default: false,
  },
});

const LandPlot = mongoose.model("LandPlot", landPlotSchema);

module.exports = LandPlot;
