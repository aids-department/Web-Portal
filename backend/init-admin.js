require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/Admin");

// Use the same connection string pattern as the main server
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/webportal";

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: "admin" });
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    // Create new admin
    const admin = new Admin({
      username: "admin",
      password: "admin123"
    });

    await admin.save();
    console.log("✓ Admin user created successfully");
    console.log("Username: admin");
    console.log("Password: admin123");
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();