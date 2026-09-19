const express = require("express");
const { body, validationResult } = require("express-validator");
const supabase = require("../config/supabaseClient");
const { serializeAlumni } = require("../lib/serializers");

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

const ALUMNI_FIELD_MAP = {
  name: "name",
  email: "email",
  phone: "phone",
  passOutYear: "pass_out_year",
  company: "company",
  role: "role",
  skills: "skills",
  linkedinUrl: "linkedin_url",
  bio: "bio",
  achievements: "achievements",
  imageUrl: "image_url",
  isVerified: "is_verified",
};

function toColumns(body) {
  const columns = {};
  for (const [key, column] of Object.entries(ALUMNI_FIELD_MAP)) {
    if (body[key] !== undefined) columns[column] = body[key];
  }
  return columns;
}

// GET all alumni with filtering
router.get("/", async (req, res) => {
  try {
    const { passOutYear, company, skills } = req.query;

    let query = supabase.from("alumni").select("*").eq("is_verified", true);

    if (passOutYear) query = query.eq("pass_out_year", passOutYear);
    if (company) query = query.ilike("company", `%${company}%`);
    if (skills) {
      const skillsArray = skills.split(",").map((s) => s.trim());
      query = query.overlaps("skills", skillsArray);
    }

    const { data, error } = await query.order("pass_out_year", { ascending: false });
    if (error) throw error;

    res.json(data.map(serializeAlumni));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single alumni
router.get("/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("alumni")
      .select("*")
      .eq("id", req.params.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: "Alumni not found" });

    res.json(serializeAlumni(data));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new alumni
router.post("/", validateAlumni, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { data, error } = await supabase
      .from("alumni")
      .insert(toColumns(req.body))
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(serializeAlumni(data));
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
    const { data, error } = await supabase
      .from("alumni")
      .update(toColumns(req.body))
      .eq("id", req.params.id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: "Alumni not found" });

    res.json(serializeAlumni(data));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE alumni
router.delete("/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("alumni")
      .delete()
      .eq("id", req.params.id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: "Alumni not found" });

    res.json({ message: "Alumni deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET statistics
router.get("/stats/summary", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("alumni")
      .select("pass_out_year, company")
      .eq("is_verified", true);

    if (error) throw error;

    const total = data.length;

    const byYearMap = new Map();
    const byCompanyMap = new Map();
    for (const row of data) {
      byYearMap.set(row.pass_out_year, (byYearMap.get(row.pass_out_year) || 0) + 1);
      byCompanyMap.set(row.company, (byCompanyMap.get(row.company) || 0) + 1);
    }

    const byYear = [...byYearMap.entries()]
      .map(([_id, count]) => ({ _id, count }))
      .sort((a, b) => b._id - a._id);

    const topCompanies = [...byCompanyMap.entries()]
      .map(([_id, count]) => ({ _id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    res.json({ total, byYear, topCompanies });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
