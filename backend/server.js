// ============================================
// MERGED BACKEND SERVER
// Features: Alumni, Events, Posts, Question Papers, Auth, Cloudinary, Google Calendar
// ============================================

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

// Import Routes
const alumniRoutes = require("./routes/alumni");

// Import Models
const Event = require("./models/Event");
const User = require("./models/User");
const Admin = require("./models/Admin");
const { Post, Comment } = require("./models/Post");
const QuestionPaper = require("./models/QuestionPaper");
const Profile = require("./models/Profile");
const { generateToken } = require('./middleware/auth');
// Updates Schema
const updateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Update = mongoose.model('RecentUpdate', updateSchema);

const app = express();
const PORT = process.env.PORT || 5000;
const postsRouter = require('./routes/post');
const leaderboardRoutes = require("./routes/leaderboard");
const profileRoutes = require("./routes/profile");
const achievementRoutes = require("./routes/achievements");

// ============================================
// CLOUDINARY CONFIG
// ============================================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log("✓ Cloudinary configured");

// ============================================
// MULTER CONFIG FOR IMAGE UPLOAD AND PDF UPLOAD
// ============================================
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|pdf/;
    const valid = allowed.test(path.extname(file.originalname).toLowerCase());
    if (valid) cb(null, true);
    else cb(new Error("Only image and PDF files allowed"));
  },
});

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

// ============================================
// CLOUDINARY IMAGE SERVICE
// ============================================
class ImageService {
  async uploadImage(filePath, fileName) {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "posts",
      public_id: `${Date.now()}-${path.parse(fileName).name}`,
      resource_type: "image",
      transformation: [{ width: 1200, crop: "limit" }, { quality: "auto" }],
    });
    return {
      imageUrl: result.secure_url,
      publicId: result.public_id,
    };
  }

  async deleteImage(publicId) {
    await cloudinary.uploader.destroy(publicId);
  }
}
const imageService = new ImageService();

// ============================================
// MONGODB CONNECTION
// ============================================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✓ Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  });

// ============================================
// EXPRESS MIDDLEWARE
// ============================================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://web-portal-gold.vercel.app",
      "https://web-portal-760h.onrender.com",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/profile", profileRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/achievements", achievementRoutes);

// ============================================
// GOOGLE CALENDAR SETUP
// ============================================

const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];
const CREDENTIALS_PATH = path.join(__dirname, "credentials.json");
const TOKEN_PATH = path.join(__dirname, "token.json");

const DEPT_CALENDAR_ID =
  process.env.DEPT_CALENDAR_ID ||
  "c_8c051af583a2abbcf59dafaa753954df357ef63678c4bcf71daf7d27c251bc92@group.calendar.google.com";

let oAuth2Client = null;

if (fs.existsSync(CREDENTIALS_PATH)) {
  const creds = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_secret, client_id, redirect_uris } = creds.web;

  oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  if (fs.existsSync(TOKEN_PATH)) {
    oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));
    console.log("✓ Google Calendar token loaded");
  } else {
    console.log("Token not found – visit /calendar/auth to authorize");
  }
} else {
  console.log("⚠ No credentials.json found – Calendar disabled");
}

app.get("/calendar/auth", (req, res) => {
  if (!oAuth2Client)
    return res.status(500).send("OAuth client missing – add credentials.json");

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  res.json({ url: authUrl });
});

app.get("/calendar/oauth2callback", async (req, res) => {
  try {
    const { tokens } = await oAuth2Client.getToken(req.query.code);

    oAuth2Client.setCredentials(tokens);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));

    console.log("✓ Token saved");
    res.send("Google Calendar connected! You may close this window.");
  } catch (err) {
    console.error("OAuth error:", err);
    res.status(500).send("OAuth failed");
  }
});

async function createCalendarEvent(payload) {
  if (!fs.existsSync(TOKEN_PATH))
    throw new Error("Not authorized – run /calendar/auth");

  oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));

  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

  const eventData = {
    summary: payload.title,
    location: payload.venue,
    description: payload.description,
    start: {
      date: payload.startDate,
    },
    end: {
      date: payload.endDate,
    },
  };

  const response = await calendar.events.insert({
    calendarId: DEPT_CALENDAR_ID,
    resource: eventData,
  });

  return response.data;
}

// ============================================
// ADMIN AUTHENTICATION ROUTES
// ============================================

// ADMIN LOGIN
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const admin = await Admin.findOne({ username });

    if (!admin || admin.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Admin schema has role: { default: 'admin' }
    // so the JWT will carry role:'admin' automatically
    const token = generateToken(admin);

    console.log('✓ Admin logged in:', admin.username);

    res.json({
      success: true,
      message: 'Admin login successful',
      token,        // ← this is what was missing before
      admin: {
        id:       admin._id,
        username: admin.username,
        role:     admin.role,
      },
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// AUTHENTICATION ROUTES
// ============================================

// SIGNUP
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { fullName, username, email, password, year } = req.body;

    if (!fullName || !username || !email || !password || !year) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (await User.findOne({ username: username.toLowerCase() })) {
      return res.status(400).json({ error: 'Username already taken' });
    }
    if (await User.findOne({ email: email.toLowerCase() })) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const newUser = await User.create({
      fullName,
      username,
      email,
      password,   // plain text — fine for now
      year,
      role: 'user',
    });

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id:       newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email:    newUser.email,
        year:     newUser.year,
        role:     newUser.role,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Please provide credentials' });
    }

    const user = await User.findOne({
      $or: [
        { username: identifier.toLowerCase() },
        { email:    identifier.toLowerCase() },
      ],
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // generateToken now correctly reads role from DB
    // because we added role to the User schema
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id:       user._id.toString(),
        fullName: user.fullName,
        username: user.username,
        email:    user.email,
        year:     user.year,
        role:     user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// participation count
// ============================================
// 1. Define Schemas
const updateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const statsSchema = new mongoose.Schema({
  key: { type: String, default: "participant_count" },
  value: { type: Number, default: 23 }
});

const Update = mongoose.model('RecentUpdate', updateSchema);
const Stats = mongoose.model('Stats', statsSchema);

// 2. Add Routes
app.get('/api/updates', async (req, res) => {
  const updates = await Update.find().sort({ createdAt: -1 }).limit(10);
  res.json(updates);
});

app.get('/api/stats', async (req, res) => {
  let stats = await Stats.findOne({ key: "participant_count" });
  if (!stats) stats = await Stats.create({ key: "participant_count", value: 23 });
  res.json(stats);
});

app.put('/api/stats', async (req, res) => {
  const stats = await Stats.findOneAndUpdate(
      { key: "participant_count" },
      { value: req.body.value },
      { new: true, upsert: true }
  );
  res.json(stats);
});

// ============================================
// POSTS ROUTES
// ============================================

// GET ALL POSTS
app.use("/api/posts", postsRouter);
// ============================================
// API ROUTES – EVENTS CRUD
// ============================================

app.get("/api/events", async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });
  res.json(events);
});

app.get("/api/events/:id", async (req, res) => {
  const event = await Event.findById(req.params.id);
  res.json(event);
});

app.post("/api/events", upload.single("poster"), async (req, res) => {
  let temp = null,
    publicId = null;

  try {
    const eventData = { ...req.body };

    if (req.file) {
      temp = req.file.path;
      const uploaded = await imageService.uploadImage(temp, req.file.originalname);
      eventData.poster = uploaded.imageUrl;
      eventData.thumbnailUrl = uploaded.thumbnailUrl;
      eventData.posterPublicId = uploaded.publicId;
      publicId = uploaded.publicId;
    }

    const newEvent = new Event(eventData);
    const savedEvent = await newEvent.save();

    console.log("✓ Event added:", savedEvent.eventName);

    if (process.env.ENABLE_CALENDAR_SYNC === "true") {
      try {
        await createCalendarEvent({
          title: savedEvent.eventName,
          venue: savedEvent.venue,
          description: savedEvent.description,
          startDate: savedEvent.startDate,
          endDate: savedEvent.endDate,
        });

        console.log("✓ Synced to Google Calendar");
      } catch (err) {
        console.error("Calendar sync failed:", err.message);
      }
    }


    res.json({ success: true, event: savedEvent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (temp && fs.existsSync(temp)) fs.unlinkSync(temp);
  }
})
;
app.put("/api/events/:id", async (req, res) => {
  try {

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(updatedEvent);

  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update event" });
  }
});
app.put("/api/events/:id", upload.single("poster"), async (req, res) => {
  try {

    const updateData = {
      eventName: req.body.eventName,
      eventType: req.body.eventType,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      venue: req.body.venue,
      eventMode: req.body.eventMode,
      organizer: req.body.organizer,
      description: req.body.description,
      registrationLink: req.body.registrationLink,
      contact: req.body.contact,
      deadlines: req.body.deadlines,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      hackProblemStatements: req.body.hackProblemStatements,
      hackTechStack: req.body.hackTechStack,
      hackJudgingCriteria: req.body.hackJudgingCriteria,
      hackPrizes: req.body.hackPrizes,
      hackMentors: req.body.hackMentors,
      hackRules: req.body.hackRules,
      theme: req.body.theme,
      teamSize: req.body.teamSize
    };

    if (req.file) {
      updateData.poster = req.file.path;
    }

    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
});

app.delete("/api/events/:id", async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event.posterPublicId) {
    await imageService.deleteImage(event.posterPublicId);
  }

  await Event.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ============================================
// QUESTION PAPER ROUTES (PDFs)
// ============================================

// 1. UPLOAD PDF (With Error Handling for Large Files)
app.post("/api/qp", (req, res, next) => {
  // Wrap upload in a function to catch Multer errors
  upload.single("pdfFile")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "File too large. Maximum limit is 10MB." });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    // If no error, proceed to the main logic
    next();
  });
}, async (req, res) => {
  try {
    const { semester, subjectCode, subjectName, examType, authorId } = req.body;
    
    if (!req.file) return res.status(400).json({ error: "PDF file is required" });
    if (!authorId) return res.status(400).json({ error: "Author ID is required" });

    // Sanitize Filename
    const cleanExamType = examType.trim().replace(/\s+/g, "_"); 
    const cleanCode = subjectCode.trim().replace(/\s+/g, "_");
    const publicId = `${cleanCode}_${cleanExamType}_${Date.now()}.pdf`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "question_papers",
      resource_type: "raw", 
      public_id: publicId,
      use_filename: true,
      unique_filename: false
    });

    const newQP = new QuestionPaper({
      semester,
      subjectCode,
      subjectName,
      examType,
      fileName: req.file.originalname,
      fileUrl: result.secure_url,
      publicId: result.public_id,
      author: authorId,
    });

    await newQP.save();
    fs.unlinkSync(req.file.path);

    const populatedQP = await QuestionPaper.findById(newQP._id).populate("author", "username fullName");
    res.json({ success: true, data: populatedQP });

  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error("QP Upload Error:", err);
    res.status(500).json({ error: "Server Error: " + err.message });
  }
});

// 2. GET ALL PAPERS (Updated to populate author details)
app.get("/api/qp", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { subjectName: { $regex: search, $options: "i" } },
          { subjectCode: { $regex: search, $options: "i" } },
        ],
      };
    }

    // ✅ .populate() fills in the author field with actual user data
    const papers = await QuestionPaper.find(query)
      .populate("author", "username fullName email") 
      .sort({ uploadedAt: -1 });
      
    res.json(papers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. DELETE PAPER
app.delete("/api/qp/:id", async (req, res) => {
  try {
    const paper = await QuestionPaper.findById(req.params.id);
    if (!paper) return res.status(404).json({ error: "Paper not found" });

    // Try deleting as 'image' first (Cloudinary sometimes treats PDFs as images), then 'raw'
    try {
        await cloudinary.uploader.destroy(paper.publicId);
    } catch (e) {
        await cloudinary.uploader.destroy(paper.publicId, { resource_type: "raw" });
    }

    await QuestionPaper.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// UPDATES ROUTES
// ============================================

app.get("/api/updates", async (req, res) => {
  try {
    const updates = await Update.find().sort({ createdAt: -1 }).limit(10);
    res.json(updates);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
});

app.post("/api/updates", async (req, res) => {
  try {
    const newUpdate = new Update({ title: req.body.title });
    await newUpdate.save();
    res.status(201).json(newUpdate);
  } catch (err) {
    res.status(500).json({ error: "Save failed" });
  }
});

app.delete("/api/updates/:id", async (req, res) => {
  try {
    await Update.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

// ============================================
// ALUMNI ROUTES
// ============================================
app.use("/api/alumni", alumniRoutes);


app.get("/health", (req, res) => {
  res.json({ message: "Backend is running" });
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
  console.log("→ MongoDB Connected");
  console.log("→ Cloudinary Ready");
  console.log("→ Google Calendar Ready");
  console.log("→ Authentication Enabled");
  console.log("→ Posts System Enabled");
  console.log("→ Alumni Routes Enabled");
  console.log(`  Authorize: http://localhost:${PORT}/calendar/auth`);
});
app.put("/api/events/:id", upload.single("poster"), async (req, res) => {

  try {

    const id = req.params.id;

    const updateData = {
      ...req.body
    };

    if (req.file) {
      updateData.poster = req.file.path;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json(updatedEvent);

  } catch (error) {

    res.status(500).json({ error: "Update failed" });

  }

});


app.delete("/api/events/:id", async (req, res) => {
  try {

    const eventId = req.params.id;

    await Event.findByIdAndDelete(eventId);

    res.json({ message: "Event deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: "Failed to delete event" });
  }
});

app.get('/api/migrate-posts', async (req, res) => {
  try {
    const { Post, Comment } = require('./models/Post');

    const postResult = await Post.updateMany(
      { isDeleted: { $exists: false } },
      { $set: { isDeleted: false, isEdited: false, isAnonymous: false } }
    );

    // Also fix posts that have isDeleted but missing isAnonymous
    const anonResult = await Post.updateMany(
      { isAnonymous: { $exists: false } },
      { $set: { isAnonymous: false } }
    );

    const commentResult = await Comment.updateMany(
      { isDeleted: { $exists: false } },
      { $set: { isDeleted: false, isEdited: false, isAnonymous: false } }
    );

    res.json({
      success:          true,
      postsMigrated:    postResult.modifiedCount,
      anonFixed:        anonResult.modifiedCount,
      commentsMigrated: commentResult.modifiedCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
