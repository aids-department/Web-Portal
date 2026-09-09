import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Field from "../components/ui/Field";
import Button from "../components/ui/Button";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://web-portal-760h.onrender.com/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("adminAuth", "true");
        localStorage.setItem("adminData", JSON.stringify(data.admin));
        navigate("/adminpage");
      } else {
        alert(data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ds-ground flex items-center justify-center px-gutter-mobile sm:px-gutter">
      <div className="bg-white border border-ds-edge w-full max-w-md">
        <div className="bg-navy px-8 py-7 flex flex-col gap-2">
          <span className="text-kicker tracking-kicker uppercase text-ds-red">Internal</span>
          <h1 className="text-section-heading text-white">Admin portal</h1>
          <p className="text-body text-on-navy">Sign in to access the dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-4">
          <div>
            <Field.Label htmlFor="admin-username">Username</Field.Label>
            <Field.Input
              id="admin-username"
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              required
            />
          </div>
          <div>
            <Field.Label htmlFor="admin-password">Password</Field.Label>
            <Field.Input
              id="admin-password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
            />
          </div>
          <Button type="submit" variant="navy" disabled={loading} className="w-full justify-center">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
          <p className="text-label text-ds-ink-faint text-center">Demo: admin / admin123</p>
        </form>
      </div>
    </div>
  );
}
