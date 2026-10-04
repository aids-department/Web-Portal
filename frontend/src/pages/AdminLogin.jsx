import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import AmbientBackground from "../components/ui/AmbientBackground";
import { Alert } from "../components/ui/States";
import { EASE } from "../components/ui/motion";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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
        toast.success("Welcome back, Administrator!");
        navigate("/adminpage");
      } else {
        const msg = data.error || "Invalid credentials. Please verify username and password.";
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      console.error("Login error:", err);
      const msg = "Unable to connect to login server. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center p-4">
      <AmbientBackground />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative w-full max-w-md"
      >
        <div aria-hidden="true" className="absolute -inset-8 rounded-[40px] bg-accent/15 blur-[70px]" />
        <div className="edge-highlight relative rounded-2xl border border-white/10 bg-canvas-elevated/85 p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_24px_80px_rgba(0,0,0,0.6),0_0_120px_rgba(94,106,210,0.12)] backdrop-blur-xl sm:p-10">
          {/* Return to portal link */}
          <div className="mb-6">
            <Link to="/" className="btn-ghost btn-sm -ml-3">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Public Portal
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="relative mx-auto mb-5 grid h-14 w-14 place-items-center">
              <div aria-hidden="true" className="absolute inset-0 rounded-2xl bg-accent/40 blur-xl" />
              <div className="icon-tile relative h-14 w-14 rounded-2xl">
                <ShieldCheck className="h-7 w-7 text-accent-bright" strokeWidth={1.5} />
              </div>
            </div>
            <span className="eyebrow-accent mb-2 justify-center">
              Department of AI &amp; DS
            </span>
            <h1 className="text-2xl font-semibold tracking-tight">
              <span className="text-gradient">Admin Portal</span>
            </h1>
            <p className="mt-1.5 text-[13px] text-fg-muted">Sign in with authorized faculty or admin credentials</p>
          </div>

          {/* Error Banner if any */}
          {error && <Alert className="mb-5">{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="field-label">Username</label>
              <input
                type="text"
                className="field py-3"
                placeholder="Enter administrator username"
                value={credentials.username}
                onChange={(e) => {
                  setError("");
                  setCredentials({ ...credentials, username: e.target.value });
                }}
                required
              />
            </div>

            <div>
              <label className="field-label">Password</label>
              <input
                type="password"
                className="field py-3"
                placeholder="••••••••••••"
                value={credentials.password}
                onChange={(e) => {
                  setError("");
                  setCredentials({ ...credentials, password: e.target.value });
                }}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary btn-lg mt-2 w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Authenticating…</span>
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-line pt-6 text-center">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-fg-muted">
              Protected internal route • Authorized personnel only
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
