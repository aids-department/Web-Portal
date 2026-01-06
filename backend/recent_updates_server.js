const path = require('path');
// This forces dotenv to look exactly in the current backend directory
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Debugging check:
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
    console.error("❌ ERROR: MONGODB_URI is undefined!");
    console.log("Check if your ..env file is in:", __dirname);
    process.exit(1);
}

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Recent Updates Server connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- REMAINING SERVER CODE ---
const updateSchema = new mongoose.Schema({
    title: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const Update = mongoose.model('RecentUpdate', updateSchema);

app.get('/api/updates', async (req, res) => {
    try {
        const updates = await Update.find().sort({ createdAt: -1 }).limit(10);
        res.status(200).json(updates);
    } catch (err) { res.status(500).json({ error: 'Fetch failed' }); }
});

app.post('/api/updates', async (req, res) => {
    try {
        const newUpdate = new Update({ title: req.body.title });
        await newUpdate.save();
        res.status(201).json(newUpdate);
    } catch (err) { res.status(500).json({ error: 'Save failed' }); }
});

app.delete('/api/updates/:id', async (req, res) => {
    try {
        await Update.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted" });
    } catch (err) { res.status(500).json({ error: "Delete failed" }); }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Updates Server running on port ${PORT}`));