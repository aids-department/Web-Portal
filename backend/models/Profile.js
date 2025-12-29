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
    bio: String,
    skills: [String],
    profileImage: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);
