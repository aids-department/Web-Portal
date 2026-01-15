const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: String,
    year: String,
    dob: String,
    registerNumber: String,
    bio: String,
    skills: [String],
    socialLinks: {
      github: String,
      leetcode: String,
      linkedin: String,
    },
    profileImage: {
      url: String,
      publicId: String,
    },
    resume: {
      url: String,
      publicId: String,
      filename: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);
