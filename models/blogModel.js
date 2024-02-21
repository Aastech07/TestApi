const mongoose = require("mongoose");

const blogsSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String },
    isActive: { type: Boolean, required: true, default: true },
    isApproved: {
      type: Boolean,
      default: function () {
        return this.isActive; // Adjusted default value to isActive
      },
    },
    createdTimestamp: {
      type: Date,
      default: Date.now, // Set a default value using Date.now
    },
  },
  {
    timestamps: {
      createdAt: false, 
      updatedAt: false, // Disable the default updatedAt field
    },
  }
);

const Blog = mongoose.model("Blog", blogsSchema);

module.exports = Blog;
