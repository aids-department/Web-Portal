import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroCanvas from '../components/HeroCanvas';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: '', // Can be username or email
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.identifier || !formData.password) {
      setError('Please enter your credentials');
      return;
    }

    setLoading(true);

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://web-portal-760h.onrender.com');
      const response = await fetch(`${apiBase}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/posts');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-brand bg-brand-ground px-5 sm:px-8 lg:px-11 py-8 sm:py-9 lg:py-11">
      <div className="max-w-[940px] mx-auto border border-brand-edge grid grid-cols-1 md:grid-cols-2">
        {/* Info panel */}
        <div className="relative bg-brand-navy-deep p-8 flex flex-col justify-between gap-10 min-h-[300px] md:min-h-[420px] overflow-hidden">
          <div className="relative z-10 flex items-center gap-2.5">
            <div className="w-6 h-6 bg-white grid place-items-center">
              <div className="w-2 h-2 bg-brand-red" />
            </div>
            <span className="font-bold text-[12.5px] tracking-[0.14em] text-white">AI &amp; DS</span>
          </div>
          <div className="absolute inset-0 opacity-80">
            <HeroCanvas />
          </div>
          <div className="relative z-10 flex flex-col gap-3">
            <h2 className="m-0 text-[28px] leading-[1.15] font-semibold text-white max-w-[16ch]">
              Members see more of the department
            </h2>
            <p className="m-0 max-w-[40ch] text-[13.5px] leading-[1.65] text-brand-on-navy">
              Posts need an account to keep discussion tied to real members. Everything else stays open to visitors.
            </p>
          </div>
        </div>

        {/* Form panel */}
        <div className="bg-white p-8 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="m-0 text-[30px] font-semibold tracking-[-0.02em] text-brand-navy">Sign in</h1>
            <span className="text-[13px] text-brand-ink-soft">Login to AI &amp; DS Department</span>
          </div>
          <div className="h-0.5 bg-brand-navy" />

          {error && (
            <div className="bg-brand-red-tint text-brand-red-deep px-3.5 py-3 text-[13px]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-medium tracking-[0.16em] uppercase text-brand-ink-soft">
                Roll number or email
              </span>
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Roll number (e.g. 23d102) or email"
                className="border border-brand-ink-faint px-3 py-3 text-[13.5px] text-brand-ink outline-none focus:border-brand-navy"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-medium tracking-[0.16em] uppercase text-brand-ink-soft">
                Password
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="border border-brand-ink-faint px-3 py-3 text-[13.5px] text-brand-ink outline-none focus:border-brand-navy"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="text-left px-[18px] py-3.5 bg-brand-red text-white font-semibold text-[13px] disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>



        </div>
      </div>
    </div>
  );
};

export default LoginPage;
