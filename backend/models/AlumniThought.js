const mongoose = require("mongoose");

const alumniThoughtSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Thought text is required"],
      trim: true,
      validate: {
        validator: function (v) {
          // 100 word limit
          return v.trim().split(/\s+/).length <= 100;
        },
        message: "Thought cannot exceed 100 words",
      },
    },
    authorName: {
      type: String,
      required: true,
      trim: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AlumniThought", alumniThoughtSchema);
