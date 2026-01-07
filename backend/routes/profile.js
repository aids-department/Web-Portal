const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");

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
