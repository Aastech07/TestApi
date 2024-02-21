const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  EventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  Albumtitle: {
    type: String,
    required: true,
  },
  image: [{ type: String }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Gallery = mongoose.model("Gallery", gallerySchema);

module.exports = Gallery;
