const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [50, "Name cannot be longer than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    phone: {
      type: String,
      match: [/^\d{10}$/, "Please provide a valid phone number"],
    },
    passOutYear: {
      type: Number,
      required: [true, "Please provide pass out year"],
      min: 2000,
      max: new Date().getFullYear(),
    },
    company: {
      type: String,
      required: [true, "Please provide company name"],
      trim: true,
    },
    role: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    linkedinUrl: {
      type: String,
      match: [
        /^(https?:\/\/)?(www\.)?linkedin\.com\/.+$/,
        "Please provide a valid LinkedIn URL",
      ],
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot be longer than 500 characters"],
    },
    achievements: {
      type: [String],
      default: [],
    },
    imageUrl: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alumni", alumniSchema);