const mongoose = require("mongoose");

const matrimonialSchema = new mongoose.Schema({
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserV1",
    required: true,
  },
  profileCreatedBy: String,
  images: [{ type: String }],
  patrika: [{ type: String }],
  nativePlace: String,
  healthInformation: String,
  anyDisability: String,
  bloodGroup: String,
  religiousBackground: {
    religion: String,
    motherTongue: String,
    community: String,
    subCommunity: String,
    gothraGothram: String,
  },
  family: {
    fatherStatus: String,
    with: String,
    as: String,
    natureOfBusiness: String,
    motherStatus: String,
    familyLocation: String,
    numberOfSiblings: {
      type: Number,
      default: 0,
    },
    familyType: String,
    familyValues: String,
    familyAffluence: String,
  },
  astroDetails: {
    manglikChevvaidosham: {
      type: String,
      enum: ["Yes", "No", "NotSure"],
    },
    nakshatra: String,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  hobbies: [String],
  partnerPreferences: {
    ageRange: {
      min: Number,
      max: Number,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    education: String,
    profession: String,
    minHeight: Number,
    maxIncome: Number,
  },
  educationAndCareer: {
    highestQualification: String,
    collegeAttended: String,
    workingWith: String,
    workingAs: String,
  },
  lifestyle: String,
  locationOfGroom: {
    countryLivingIn: String,
    stateLivingIn: String,
    cityLivingIn: String,
    grewUpIn: String,
    ethnicOrigin: String,
    zipPinCode: Number,
  },
  moreAboutYourselfPartnerAndFamily: String,
  height: String,
  aboutMe: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MatrimonialProfile = mongoose.model(
  "MatrimonialProfile",
  matrimonialSchema
);

module.exports = MatrimonialProfile;
