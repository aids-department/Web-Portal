const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
const { serializeLeaderboardRow } = require("../lib/serializers");

// GET leaderboard by category
router.get("/:category", async (req, res) => {
  try {
    const { category } = req.params;

    const { data, error } = await supabase
      .from("leaderboard_rows")
      .select("*")
      .eq("category", category)
      .order("score", { ascending: false })
      .order("time", { ascending: true })
      .limit(10);

    if (error) throw error;

    res.json(data.map(serializeLeaderboardRow));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// ADD / UPDATE leaderboard row (admin) — UPSERT ✅
router.post("/", async (req, res) => {
  try {
    const { category, name, roll, year, score, time } = req.body;

    const { data, error } = await supabase
      .from("leaderboard_rows")
      .upsert({ category, name, roll, year, score, time }, { onConflict: "category,roll" })
      .select()
      .single();

    if (error) throw error;

    res.json(serializeLeaderboardRow(data));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save leaderboard row" });
  }
});

// DELETE leaderboard by category (ADMIN)
router.delete("/:category", async (req, res) => {
  try {
    const { category } = req.params;

    const { error } = await supabase.from("leaderboard_rows").delete().eq("category", category);
    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    console.error("Delete leaderboard failed:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
