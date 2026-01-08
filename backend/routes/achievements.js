const express = require("express");
const router = express.Router();
const Achievement = require("../models/Achievement");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files allowed"));
  },
});


router.post("/", upload.single("certificate"), async (req, res) => {
  let uploadedCert = null;

  try {
    const { userId, title, description } = req.body;

    if (!userId || !title) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ----- Upload certificate to Cloudinary (if exists) -----
    if (req.file) {
      const originalName = req.file.originalname
        .replace(/\s+/g, "_")
        .replace(/\.pdf$/i, "");

      const publicId = `cert_${originalName}_${Date.now()}.pdf`;

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "certificates",
        resource_type: "raw",
        public_id: publicId,
        use_filename: true,
        unique_filename: false,
      });

      uploadedCert = {
        url: result.secure_url,
        publicId: result.public_id,
      };

      fs.unlinkSync(req.file.path); // cleanup temp file
    }

    const achievement = new Achievement({
      userId,
      title,
      description,
      status: "pending",
      certificate: uploadedCert,
    });

    await achievement.save();

    res.json({ message: "Achievement submitted for approval" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/pending", async (req, res) => {
  try {
    const pending = await Achievement.find({ status: "pending" })
      .populate("userId", "fullName username year")
      .sort({ createdAt: -1 });

    res.json(pending);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/:id/approve", async (req, res) => {
  const achievement = await Achievement.findById(req.params.id);
  if (!achievement) return res.status(404).json({ error: "Not found" });

  achievement.status = "approved";
  achievement.reviewedBy = req.body.adminId;
  achievement.reviewedAt = new Date();

  await achievement.save(); // ← THIS LINE IS CRITICAL

  res.json({ message: "Achievement approved" });
});


router.patch("/:id/reject", async (req, res) => {
  const achievement = await Achievement.findById(req.params.id);
  if (!achievement) return res.status(404).json({ error: "Not found" });

  achievement.status = "rejected";
  achievement.reviewedBy = req.body.adminId;
  achievement.reviewedAt = new Date();
  achievement.rejectionReason = req.body.reason;

  await achievement.save(); // ← ALSO REQUIRED

  res.json({ message: "Achievement rejected" });
});


router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { all } = req.query;

    const filter = { userId };

    // Only profile page should see approved
    if (!all) {
      filter.status = "approved";
    }

    const achievements = await Achievement.find(filter).sort({
      createdAt: -1,
    });

    res.json(achievements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/approved/recent", async (req, res) => {
  try {
    const achievements = await Achievement.find({
      status: "approved",
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("userId", "fullName year");

    res.json(achievements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({ error: "Achievement not found" });
    }

    // 🔥 Delete certificate from Cloudinary (if exists)
    if (achievement.certificate?.publicId) {
      await cloudinary.uploader.destroy(
        achievement.certificate.publicId,
        { resource_type: "raw" } // IMPORTANT for PDFs
      );
    }

    // Delete achievement from DB
    await Achievement.findByIdAndDelete(req.params.id);

    res.json({ message: "Achievement deleted" });
  } catch (err) {
    console.error("Achievement delete failed:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});


module.exports = router;