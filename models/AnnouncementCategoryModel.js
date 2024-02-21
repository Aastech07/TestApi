const mongoose = require("mongoose");

const announcementCategorySchema = new mongoose.Schema(
  {
    announcementCategoryName: {
      type: String,
      required: true,
      unique: true,
    },
    date: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: "createdTimestamp",
      updatedAt: false,
    },
  }
);

const AnnouncementCategory = mongoose.model(
  "AnnouncementCategory",
  announcementCategorySchema
);

module.exports = AnnouncementCategory;
