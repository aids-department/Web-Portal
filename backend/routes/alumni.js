const express = require("express");
const { body, validationResult } = require("express-validator");
const Alumni = require("../models/Alumni.js");

const router = express.Router();

// Validation middleware
const validateAlumni = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("passOutYear")
    .isInt({ min: 2000 })
    .withMessage("Valid pass out year is required"),
  body("company").trim().notEmpty().withMessage("Company is required"),
];

// GET all alumni with filtering
router.get("/", async (req, res) => {
  try {
    const { passOutYear, company, skills } = req.query;
    let filter = { isVerified: true };

    if (passOutYear) filter.passOutYear = passOutYear;
    if (company) filter.company = new RegExp(company, "i");
    if (skills) {
      const skillsArray = skills.split(",").map((s) => s.trim());
      filter.skills = { $in: skillsArray };
    }

    const alumni = await Alumni.find(filter).sort({ passOutYear: -1 });
    res.json(alumni);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single alumni
router.get("/:id", async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    if (!alumni)
      return res.status(404).json({ message: "Alumni not found" });
    res.json(alumni);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new alumni
router.post("/", validateAlumni, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const alumni = new Alumni(req.body);

  try {
    const savedAlumni = await alumni.save();
    res.status(201).json(savedAlumni);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update alumni
router.put("/:id", validateAlumni, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const alumni = await Alumni.findById(req.params.id);
    if (!alumni)
      return res.status(404).json({ message: "Alumni not found" });

    Object.assign(alumni, req.body);
    const updatedAlumni = await alumni.save();
    res.json(updatedAlumni);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE alumni
router.delete("/:id", async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndDelete(req.params.id);
    if (!alumni)
      return res.status(404).json({ message: "Alumni not found" });
    res.json({ message: "Alumni deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET statistics
router.get("/stats/summary", async (req, res) => {
  try {
    const total = await Alumni.countDocuments({ isVerified: true });
    const byYear = await Alumni.aggregate([
      { $match: { isVerified: true } },
      { $group: { _id: "$passOutYear", count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ]);
    const topCompanies = await Alumni.aggregate([
      { $match: { isVerified: true } },
      { $group: { _id: "$company", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json({ total, byYear, topCompanies });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;