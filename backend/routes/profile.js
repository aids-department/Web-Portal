const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const upload = multer({ dest: "uploads/" });

router.get("/", async (req, res) => {
  try {
    const q = req.query.q || "";

    if (!q.trim()) return res.json([]);

    const profiles = await Profile.find(
      {
        name: {
          $exists: true,
          $type: "string",
          $regex: q,
          $options: "i",
        },
      },
      { name: 1, year: 1, userId: 1, _id: 0 }
    ).limit(10);

    res.json(profiles);
  } catch (err) {
    console.error("Profile search error:", err);
    res.status(500).json({ error: err.message });
  }
});


/**
 * GET profile by userId
 */
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.json(null); // frontend handles empty profile
    }

    res.json(profile);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * CREATE or UPDATE profile
 */
router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const payload = req.body;
    
    console.log('Received profile update for userId:', userId);
    console.log('Payload:', payload);

    const profile = await Profile.findOneAndUpdate(
      { userId },
      { ...payload, userId },
      { new: true, upsert: true }
    );
    
    console.log('Updated profile:', profile);

    res.json(profile);
  } catch (err) {
    console.error("Error saving profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// UPLOAD / UPDATE profile image
router.post("/:userId/image", upload.single("image"), async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    const profile = await Profile.findOne({ userId });

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profiles",
      resource_type: "image",
      transformation: [
        { width: 400, height: 400, crop: "fill", gravity: "face" },
        { quality: "auto" },
      ],
    });

    // Delete old image if exists
    if (profile?.profileImage?.publicId) {
      await cloudinary.uploader.destroy(profile.profileImage.publicId);
    }

    const updated = await Profile.findOneAndUpdate(
      { userId },
      {
        profileImage: {
          url: result.secure_url,
          publicId: result.public_id,
        },
      },
      { new: true, upsert: true }
    );

    fs.unlinkSync(req.file.path); // cleanup temp file

// UPLOAD / UPDATE resume
router.post("/:userId/resume", upload.single("resume"), async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "No resume provided" });
    }

    const profile = await Profile.findOne({ userId });

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "resumes",
      resource_type: "raw", // for non-image files like PDF
    });

    // Delete old resume if exists
    if (profile?.resume?.publicId) {
      await cloudinary.uploader.destroy(profile.resume.publicId, { resource_type: "raw" });
    }

    const updated = await Profile.findOneAndUpdate(
      { userId },
      {
        resume: {
          url: result.secure_url,
          publicId: result.public_id,
          filename: req.file.originalname,
        },
      },
      { new: true, upsert: true }
    );

    fs.unlinkSync(req.file.path); // cleanup temp file

    res.json(updated.resume);
  } catch (err) {
    console.error("Resume upload error:", err);
    res.status(500).json({ error: "Failed to upload resume" });
  }
});

module.exports = router;
