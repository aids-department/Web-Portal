require("dotenv").config();
const bcrypt = require("bcrypt");
const supabase = require("./config/supabaseClient");

async function createAdmin() {
  try {
    const { data: existingAdmin, error: findErr } = await supabase
      .from("admins")
      .select("id")
      .eq("username", "admin")
      .maybeSingle();
    if (findErr) throw findErr;

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const passwordHash = await bcrypt.hash("admin123", 10);

    const { error: insertErr } = await supabase
      .from("admins")
      .insert({ username: "admin", password_hash: passwordHash });
    if (insertErr) throw insertErr;

    console.log("✓ Admin user created successfully");
    console.log("Username: admin");
    console.log("Password: admin123");
  } catch (error) {
    console.error("Error:", error);
  }
}

createAdmin();
