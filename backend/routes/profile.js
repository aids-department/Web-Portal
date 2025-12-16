const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");

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

    const profile = await Profile.findOneAndUpdate(
      { userId },
      { ...payload, userId },
      { new: true, upsert: true }
    );

    res.json(profile);
  } catch (err) {
    console.error("Error saving profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
