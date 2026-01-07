const express = require("express");
const router = express.Router();
const LeaderboardRow = require("../models/Leaderboard");

// GET leaderboard by category
router.get("/:category", async (req, res) => {
  try {
    const { category } = req.params;

    const rows = await LeaderboardRow.find({ category })
      .sort({ score: -1, time: 1 })
      .limit(10);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// ADD / UPDATE leaderboard row (admin) — UPSERT ✅
router.post("/", async (req, res) => {
  try {
    const { category, name, roll, year, score, time } = req.body;

    const row = await LeaderboardRow.findOneAndUpdate(
      { category, roll },
      { name, roll, year, score, time },
      { upsert: true, new: true }
    );

    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save leaderboard row" });
  }
});

// DELETE leaderboard by category (ADMIN)
router.delete("/:category", async (req, res) => {
  try {
    const { category } = req.params;

    await LeaderboardRow.deleteMany({ category }); // ✅ FIX

    res.json({ success: true });
  } catch (err) {
    console.error("Delete leaderboard failed:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
