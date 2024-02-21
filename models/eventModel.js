const mongoose = require("mongoose");

const eventsSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    category: { type: String, require: true },
    date: { type: String, required: true },
    address: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: {
      createdAt: "createdTimestamp",
      updatedAt: false,
    },
  }
);

const Event = mongoose.model("Event", eventsSchema);

module.exports = Event;
