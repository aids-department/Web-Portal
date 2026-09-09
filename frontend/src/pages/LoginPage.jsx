import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://web-portal-760h.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success(`Welcome back, ${data.user.username}!`);
        window.location.href = "/";
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#e8e6e3] min-h-screen flex items-center justify-center p-4">
      <div className="w-[940px] max-w-full bg-white shadow-2xl flex flex-col md:flex-row min-h-[520px]">
        
        {/* Left Side - Deep Navy Branding */}
        <div className="bg-navy-deep flex-1 relative flex flex-col justify-between p-[36px_34px] overflow-hidden">
          <div className="flex items-center gap-[10px] relative z-10">
            <div className="w-6 h-6 bg-white grid place-items-center">
              <div className="w-2 h-2 bg-ds-red"></div>
            </div>
            <span className="font-bold text-[12.5px] leading-none tracking-[.14em] text-white">AI &amp; DS</span>
          </div>
          
          {/* Abstract Canvas Background Simulation */}
          <div className="absolute inset-0 opacity-85 pointer-events-none">
            {/* The reference had an abstract canvas rendering lines. 
                Using CSS gradients/shapes to mimic the dark theme visual. */}
            <div className="absolute -left-[50%] -top-[50%] w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,rgba(27,58,107,0.3)_0%,rgba(11,23,48,0)_70%)]"></div>
          </div>

          <div className="relative z-10 flex flex-col gap-3">
            <h2 className="m-0 font-semibold text-[30px] leading-[1.15] text-white max-w-[16ch]">
              Members see more of the department
            </h2>
            <p className="m-0 max-w-[40ch] font-normal text-[13.5px] leading-[1.65] text-[#b6c2d8]">
              Posts, the alumni directory and the question bank need an account. Everything else stays open to visitors.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-[400px] bg-white p-[38px_34px] flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <h1 className="m-0 font-semibold text-[30px] leading-none tracking-[-.02em] text-navy">Sign in</h1>
            <span className="font-normal text-[13px] leading-[1.5] text-ds-ink-soft">Use your department address.</span>
          </div>
          
          <div className="h-[2px] bg-navy"></div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full m-0">
            {error && (
              <div className="p-3 bg-ds-red-tint text-ds-red text-[13px] border border-ds-red-deep">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-[7px]">
              <span className="font-medium text-[10px] leading-none tracking-[.16em] uppercase text-[#7d7979]">Email</span>
              <input 
                type="email"
                placeholder="you@aids.dept"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="border border-[#bab6b6] p-[12px_13px] font-normal text-[13.5px] leading-none text-navy placeholder:text-[#9b9797] outline-none focus:border-navy"
              />
            </div>

            <div className="flex flex-col gap-[7px]">
              <div className="flex justify-between items-end">
                <span className="font-medium text-[10px] leading-none tracking-[.16em] uppercase text-[#7d7979]">Password</span>
                <a href="#" className="font-normal text-[11px] leading-none text-ds-blue no-underline hover:underline">Forgot?</a>
              </div>
              <input 
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="border border-[#bab6b6] p-[12px_13px] font-normal text-[13.5px] leading-none text-navy placeholder:text-[#9b9797] outline-none focus:border-navy"
              />
            </div>

            <label className="flex items-center gap-[9px] font-normal text-[12.5px] leading-none text-[#3a3838] cursor-pointer">
              <span className="w-[14px] h-[14px] border border-navy bg-navy flex items-center justify-center">
                {/* SVG Checkmark */}
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5"/>
                </svg>
              </span>
              Keep me signed in on this device
            </label>

            <button 
              type="submit" 
              disabled={loading}
              className="mt-1 p-[14px_18px] bg-ds-red text-white border-none font-semibold text-[13px] leading-none text-left cursor-pointer hover:bg-ds-red-deep disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <div className="flex items-center gap-3 py-1">
              <span className="flex-1 h-px bg-ds-edge"></span>
              <span className="font-normal text-[11px] leading-none text-[#9b9797]">or</span>
              <span className="flex-1 h-px bg-ds-edge"></span>
            </div>

            <button type="button" className="p-[13px_18px] bg-white border border-[#bab6b6] font-medium text-[12.5px] leading-none text-ds-ink text-left cursor-pointer hover:bg-ds-ground">
              Continue with college Google account
            </button>

            <div className="mt-auto border-t border-ds-row pt-4 flex justify-between items-center">
              <span className="font-normal text-[12.5px] leading-none text-ds-ink-soft">New here?</span>
              <Link to="/signup" className="font-semibold text-[12.5px] leading-none text-ds-blue no-underline border-b-2 border-ds-red pb-[3px] hover:text-navy">
                Create an account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
