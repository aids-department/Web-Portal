const mongoose = require("mongoose");

const AchievementSchema = new mongoose.Schema({
  title: String,
  description: String,
});

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
    achievements: [AchievementSchema],
    profileImage: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);
