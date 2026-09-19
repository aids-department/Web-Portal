const express = require("express");
const router = express.Router();
const multer = require("multer");
const supabase = require("../config/supabaseClient");
const { uploadFile, deleteFile } = require("../lib/storage");
const { serializeProfile } = require("../lib/serializers");

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const PROFILE_FIELD_MAP = {
  name: "name",
  year: "year",
  dob: "dob",
  registerNumber: "register_number",
  bio: "bio",
  skills: "skills",
};

function toColumns(body) {
  const columns = {};
  for (const [key, column] of Object.entries(PROFILE_FIELD_MAP)) {
    if (body[key] !== undefined) columns[column] = body[key];
  }
  if (body.socialLinks) {
    if (body.socialLinks.github !== undefined) columns.social_github = body.socialLinks.github;
    if (body.socialLinks.leetcode !== undefined) columns.social_leetcode = body.socialLinks.leetcode;
    if (body.socialLinks.linkedin !== undefined) columns.social_linkedin = body.socialLinks.linkedin;
  }
  return columns;
}

/**
 * SEARCH profiles
 */
router.get("/", async (req, res) => {
  try {
    const q = req.query.q || "";
    if (!q.trim()) return res.json([]);

    const { data, error } = await supabase
      .from("profiles")
      .select("name, year, user_id")
      .ilike("name", `%${q}%`)
      .not("name", "is", null)
      .limit(10);

    if (error) throw error;

    res.json(data.map((row) => ({ name: row.name, year: row.year, userId: row.user_id })));
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

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;

    res.json(serializeProfile(data));
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

    const { data, error } = await supabase
      .from("profiles")
      .upsert({ ...toColumns(req.body), user_id: userId }, { onConflict: "user_id" })
      .select()
      .single();

    if (error) throw error;

    res.json(serializeProfile(data));
  } catch (err) {
    console.error("Error saving profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * UPLOAD / UPDATE profile image
 */
router.post("/:userId/image", upload.single("image"), async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("profile_image_path")
      .eq("user_id", userId)
      .maybeSingle();

    const uploaded = await uploadFile("profile-images", req.file.buffer, req.file.originalname, {
      folder: "profiles",
      contentType: req.file.mimetype,
    });

    if (profile?.profile_image_path) {
      await deleteFile("profile-images", profile.profile_image_path);
    }

    const { data: updated, error } = await supabase
      .from("profiles")
      .upsert(
        { user_id: userId, profile_image_url: uploaded.url, profile_image_path: uploaded.path },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (error) throw error;

    res.json({ url: updated.profile_image_url, publicId: updated.profile_image_path });
  } catch (err) {
    console.error("Image upload error:", err);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

/**
 * UPLOAD / UPDATE resume
 */
router.post("/:userId/resume", upload.single("resume"), async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "No resume provided" });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("resume_path")
      .eq("user_id", userId)
      .maybeSingle();

    const uploaded = await uploadFile("resumes", req.file.buffer, `resume_${userId}_${Date.now()}.pdf`, {
      folder: "resumes",
      contentType: "application/pdf",
    });

    if (profile?.resume_path) {
      await deleteFile("resumes", profile.resume_path);
    }

    const { data: updated, error } = await supabase
      .from("profiles")
      .upsert(
        {
          user_id: userId,
          resume_url: uploaded.url,
          resume_path: uploaded.path,
          resume_filename: req.file.originalname,
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (error) throw error;

    res.json({ url: updated.resume_url, publicId: updated.resume_path, filename: updated.resume_filename });
  } catch (err) {
    console.error("Resume upload error:", err);
    res.status(500).json({ error: "Failed to upload resume" });
  }
});

module.exports = router;
