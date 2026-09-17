import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ShieldCheck, ArrowLeft, Loader2, AlertCircle } from "lucide-react";

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-brand-red selection:text-white font-sans">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-200 w-full max-w-md">
        {/* Return to portal link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-navy transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Public Portal
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-navy text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-brand-navy/20">
            <ShieldCheck className="w-7 h-7 text-amber-300" />
          </div>
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-brand-red mb-1">
            Department of AI &amp; DS
          </span>
          <h1 className="text-2xl font-black text-brand-navy tracking-tight">Admin Portal</h1>
          <p className="text-slate-500 text-xs mt-1">Sign in with authorized faculty or admin credentials</p>
        </div>

        {/* Error Banner if any */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Username
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy focus:bg-white transition-all"
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
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy focus:bg-white transition-all"
              placeholder="••••••••••••"
              value={credentials.password}
              onChange={(e) => {
                setError("");
                setCredentials({ ...credentials, password: e.target.value });
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-brand-navy hover:bg-[#152e66] active:scale-[0.99] text-white py-3 px-4 rounded-xl transition-all font-semibold text-sm shadow-md shadow-brand-navy/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating…</span>
              </>
            ) : (
              "Sign In to Dashboard"
            )}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Protected internal route • Authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
}