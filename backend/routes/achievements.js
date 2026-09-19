const express = require("express");
const router = express.Router();
const multer = require("multer");
const supabase = require("../config/supabaseClient");
const { uploadFile, deleteFile } = require("../lib/storage");
const { serializeAchievement } = require("../lib/serializers");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files allowed"));
  },
});

function isUuid(v) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v || "");
}

router.post("/", upload.single("certificate"), async (req, res) => {
  try {
    const { userId, title, description } = req.body;

    if (!userId || !title) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let certificateUrl = null;
    let certificatePath = null;

    if (req.file) {
      const originalName = req.file.originalname.replace(/\s+/g, "_").replace(/\.pdf$/i, "");
      const uploaded = await uploadFile(
        "achievement-certificates",
        req.file.buffer,
        `cert_${originalName}_${Date.now()}.pdf`,
        { folder: "certificates", contentType: "application/pdf" }
      );
      certificateUrl = uploaded.url;
      certificatePath = uploaded.path;
    }

    const { error } = await supabase.from("achievements").insert({
      user_id: userId,
      title,
      description,
      status: "pending",
      certificate_url: certificateUrl,
      certificate_path: certificatePath,
    });

    if (error) throw error;

    res.json({ message: "Achievement submitted for approval" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/pending", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("achievements")
      .select("*, user:users(id, full_name, username, year)")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data.map((row) => serializeAchievement(row, { user: row.user })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/:id/approve", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("achievements")
      .update({ status: "approved", reviewed_by: req.body.adminId, reviewed_at: new Date().toISOString() })
      .eq("id", req.params.id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Not found" });

    res.json({ message: "Achievement approved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/:id/reject", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("achievements")
      .update({
        status: "rejected",
        reviewed_by: req.body.adminId,
        reviewed_at: new Date().toISOString(),
        rejection_reason: req.body.reason,
      })
      .eq("id", req.params.id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Not found" });

    res.json({ message: "Achievement rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { all } = req.query;

    if (!isUuid(userId)) {
      return res.json([]);
    }

    let query = supabase.from("achievements").select("*").eq("user_id", userId);
    if (!all) query = query.eq("status", "approved");

    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;

    res.json(data.map((row) => serializeAchievement(row)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/approved/recent", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("achievements")
      .select("*, user:users(id, full_name, year)")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw error;

    res.json(data.map((row) => serializeAchievement(row, { user: row.user })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { data: achievement, error: fetchErr } = await supabase
      .from("achievements")
      .select("certificate_path")
      .eq("id", req.params.id)
      .maybeSingle();

    if (fetchErr) throw fetchErr;
    if (!achievement) return res.status(404).json({ error: "Achievement not found" });

    if (achievement.certificate_path) {
      await deleteFile("achievement-certificates", achievement.certificate_path);
    }

    const { error } = await supabase.from("achievements").delete().eq("id", req.params.id);
    if (error) throw error;

    res.json({ message: "Achievement deleted" });
  } catch (err) {
    console.error("Achievement delete failed:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
