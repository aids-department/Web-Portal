// ============================================
// MERGED BACKEND SERVER
// Features: Alumni, Events, Posts, Question Papers, Auth, Supabase, Google Calendar
// ============================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require("bcrypt");
const path = require("path");
const { google } = require("googleapis");
const fs = require("fs");

const supabase = require("./config/supabaseClient");
const { uploadFile, deleteFile } = require("./lib/storage");
const {
  serializeAuthUser,
  serializeAdminAuth,
  serializeAlumniThought,
  serializeEvent,
  splitEventPayload,
  serializeQuestionPaper,
  serializeUpdate,
  serializeStats,
} = require("./lib/serializers");

// Import Routes
const alumniRoutes = require("./routes/alumni");
const postsRouter = require("./routes/post");
const leaderboardRoutes = require("./routes/leaderboard");
const profileRoutes = require("./routes/profile");
const achievementRoutes = require("./routes/achievements");

const { generateToken, verifyToken } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MULTER CONFIG (memory storage — buffers go straight to Supabase Storage)
// ============================================
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|pdf/;
    const valid = allowed.test(path.extname(file.originalname).toLowerCase());
    if (valid) cb(null, true);
    else cb(new Error("Only image and PDF files allowed"));
  },
});

console.log("✓ Supabase configured");

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

app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .maybeSingle();
    if (error) throw error;

    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(admin);

    console.log('✓ Admin logged in:', admin.username);

    res.json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: serializeAdminAuth(admin),
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

    const lowerUsername = username.toLowerCase();
    const lowerEmail = email.toLowerCase();

    const { data: existingUsername } = await supabase
      .from('users').select('id').eq('username', lowerUsername).maybeSingle();
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const { data: existingEmail } = await supabase
      .from('users').select('id').eq('email', lowerEmail).maybeSingle();
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        full_name: fullName,
        username: lowerUsername,
        email: lowerEmail,
        password_hash: passwordHash,
        year,
        role: 'user',
      })
      .select()
      .single();
    if (error) throw error;

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: serializeAuthUser(newUser),
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

    const lower = identifier.toLowerCase();

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .or(`username.eq.${lower},email.eq.${lower}`)
      .maybeSingle();
    if (error) throw error;

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: serializeAuthUser(user),
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// participation count
// ============================================
app.get('/api/stats', async (req, res) => {
  try {
    let { data: stats, error } = await supabase
      .from('stats').select('*').eq('key', 'participant_count').maybeSingle();
    if (error) throw error;

    if (!stats) {
      const { data: created, error: insertErr } = await supabase
        .from('stats').insert({ key: 'participant_count', value: 23 }).select().single();
      if (insertErr) throw insertErr;
      stats = created;
    }

    res.json(serializeStats(stats));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/stats', async (req, res) => {
  try {
    const { data: stats, error } = await supabase
      .from('stats')
      .upsert({ key: 'participant_count', value: req.body.value }, { onConflict: 'key' })
      .select()
      .single();
    if (error) throw error;

    res.json(serializeStats(stats));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// POSTS ROUTES
// ============================================
app.use("/api/posts", postsRouter);

// ============================================
// ALUMNI THOUGHTS ROUTES
// ============================================
app.get("/api/alumni-thoughts", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('alumni_thoughts').select('*').order('created_at', { ascending: false });
    if (error) throw error;

    res.json(data.map(serializeAlumniThought));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/alumni-thoughts", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "alumni") {
      return res.status(403).json({ error: "Only alumni can post thoughts." });
    }

    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Thought text is required." });
    }

    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount > 100) {
      return res.status(400).json({ error: "Thought cannot exceed 100 words." });
    }

    const { data: user, error: userErr } = await supabase
      .from('users').select('*').eq('id', req.user.id).maybeSingle();
    if (userErr) throw userErr;
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const { data: thought, error } = await supabase
      .from('alumni_thoughts')
      .insert({ text: text.trim(), author_name: user.full_name, author_id: user.id })
      .select()
      .single();
    if (error) throw error;

    res.status(201).json(serializeAlumniThought(thought));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// API ROUTES – EVENTS CRUD
// ============================================

app.get("/api/events", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('events').select('*').order('created_at', { ascending: false });
    if (error) throw error;

    res.json(data.map(serializeEvent));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/events/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('events').select('*').eq('id', req.params.id).maybeSingle();
    if (error) throw error;

    res.json(data ? serializeEvent(data) : null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/events", upload.single("poster"), async (req, res) => {
  try {
    const { columns, details } = splitEventPayload(req.body);

    if (req.file) {
      const uploaded = await uploadFile('event-posters', req.file.buffer, req.file.originalname, {
        folder: 'events',
        contentType: req.file.mimetype,
      });
      columns.poster_url = uploaded.url;
      columns.poster_path = uploaded.path;
    }

    const { data: savedEvent, error } = await supabase
      .from('events')
      .insert({ ...columns, details })
      .select()
      .single();
    if (error) throw error;

    console.log("✓ Event added:", savedEvent.event_name);

    if (process.env.ENABLE_CALENDAR_SYNC === "true") {
      try {
        await createCalendarEvent({
          title: savedEvent.event_name,
          venue: savedEvent.venue,
          description: savedEvent.description,
          startDate: savedEvent.start_date,
          endDate: savedEvent.end_date,
        });

        console.log("✓ Synced to Google Calendar");
      } catch (err) {
        console.error("Calendar sync failed:", err.message);
      }
    }

    res.json({ success: true, event: serializeEvent(savedEvent) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Single consolidated handler (the original file registered three
// conflicting PUT /api/events/:id routes — Express only ever runs the
// first match, so poster replacement on edit was silently a no-op).
app.put("/api/events/:id", upload.single("poster"), async (req, res) => {
  try {
    const { columns, details } = splitEventPayload(req.body);

    if (req.file) {
      const { data: existing } = await supabase
        .from('events').select('poster_path').eq('id', req.params.id).maybeSingle();

      const uploaded = await uploadFile('event-posters', req.file.buffer, req.file.originalname, {
        folder: 'events',
        contentType: req.file.mimetype,
      });
      columns.poster_url = uploaded.url;
      columns.poster_path = uploaded.path;

      if (existing?.poster_path) await deleteFile('event-posters', existing.poster_path);
    }

    const updatePayload = { ...columns };
    if (Object.keys(details).length > 0) {
      const { data: current } = await supabase
        .from('events').select('details').eq('id', req.params.id).maybeSingle();
      updatePayload.details = { ...(current?.details || {}), ...details };
    }

    const { data: updated, error } = await supabase
      .from('events')
      .update(updatePayload)
      .eq('id', req.params.id)
      .select()
      .maybeSingle();
    if (error) throw error;

    if (!updated) return res.status(404).json({ message: "Event not found" });

    res.json(serializeEvent(updated));
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update event" });
  }
});

// Single consolidated handler (the original file also registered a
// second, dead-code duplicate of this route).
app.delete("/api/events/:id", async (req, res) => {
  try {
    const { data: event } = await supabase
      .from('events').select('poster_path').eq('id', req.params.id).maybeSingle();

    if (event?.poster_path) {
      await deleteFile('event-posters', event.poster_path);
    }

    const { error } = await supabase.from('events').delete().eq('id', req.params.id);
    if (error) throw error;

    res.json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// ============================================
// QUESTION PAPER ROUTES (PDFs)
// ============================================

// 1. UPLOAD PDF (With Error Handling for Large Files)
app.post("/api/qp", (req, res, next) => {
  upload.single("pdfFile")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "File too large. Maximum limit is 10MB." });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { semester, subjectCode, subjectName, examType, authorId } = req.body;

    if (!req.file) return res.status(400).json({ error: "PDF file is required" });
    if (!authorId) return res.status(400).json({ error: "Author ID is required" });

    const cleanExamType = examType.trim().replace(/\s+/g, "_");
    const cleanCode = subjectCode.trim().replace(/\s+/g, "_");
    const fileName = `${cleanCode}_${cleanExamType}_${Date.now()}.pdf`;

    const uploaded = await uploadFile('question-papers', req.file.buffer, fileName, {
      folder: 'question_papers',
      contentType: 'application/pdf',
    });

    const { data: newQP, error } = await supabase
      .from('question_papers')
      .insert({
        semester,
        subject_code: subjectCode,
        subject_name: subjectName,
        exam_type: examType,
        file_name: req.file.originalname,
        file_url: uploaded.url,
        file_path: uploaded.path,
        author_id: authorId,
      })
      .select('*, author:users(id, username, full_name, email)')
      .single();
    if (error) throw error;

    res.json({ success: true, data: serializeQuestionPaper(newQP, { author: newQP.author }) });
  } catch (err) {
    console.error("QP Upload Error:", err);
    res.status(500).json({ error: "Server Error: " + err.message });
  }
});

// 2. GET ALL PAPERS (with author details)
app.get("/api/qp", async (req, res) => {
  try {
    const { search } = req.query;
    let query = supabase.from('question_papers').select('*, author:users(id, username, full_name, email)');

    if (search) {
      query = query.or(`subject_name.ilike.%${search}%,subject_code.ilike.%${search}%`);
    }

    const { data, error } = await query.order('uploaded_at', { ascending: false });
    if (error) throw error;

    res.json(data.map((row) => serializeQuestionPaper(row, { author: row.author })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. DELETE PAPER
app.delete("/api/qp/:id", async (req, res) => {
  try {
    const { data: paper } = await supabase
      .from('question_papers').select('file_path').eq('id', req.params.id).maybeSingle();
    if (!paper) return res.status(404).json({ error: "Paper not found" });

    await deleteFile('question-papers', paper.file_path);
    const { error } = await supabase.from('question_papers').delete().eq('id', req.params.id);
    if (error) throw error;

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
    const { data, error } = await supabase
      .from('recent_updates').select('*').order('created_at', { ascending: false }).limit(10);
    if (error) throw error;

    res.json(data.map(serializeUpdate));
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
});

app.post("/api/updates", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('recent_updates').insert({ title: req.body.title }).select().single();
    if (error) throw error;

    res.status(201).json(serializeUpdate(data));
  } catch (err) {
    res.status(500).json({ error: "Save failed" });
  }
});

app.delete("/api/updates/:id", async (req, res) => {
  try {
    const { error } = await supabase.from('recent_updates').delete().eq('id', req.params.id);
    if (error) throw error;

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
  console.log("→ Supabase Connected");
  console.log("→ Supabase Storage Ready");
  console.log("→ Google Calendar Ready");
  console.log("→ Authentication Enabled");
  console.log("→ Posts System Enabled");
  console.log("→ Alumni Routes Enabled");
  console.log(`  Authorize: http://localhost:${PORT}/calendar/auth`);
});
