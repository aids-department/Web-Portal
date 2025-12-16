const mongoose = require("mongoose");

const LeaderboardRowSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
    },

    roll: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: false,
    },

    score: {
      type: Number,
      required: false,
      default: null,
    },

    time: {
      type: Number,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

// Optional: Prevent duplicate students in same category
LeaderboardRowSchema.index(
  { category: 1, roll: 1 },
  { unique: true }
);

module.exports = mongoose.model("LeaderboardRow", LeaderboardRowSchema);
