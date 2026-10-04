import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import AuthShell, { BrandMark } from '../components/ui/AuthShell';
import { Alert } from '../components/ui/States';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
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
    <AuthShell
      canvas
      maxWidth="max-w-[940px]"
      aside={
        <>
          <BrandMark />
          <div className="flex flex-col gap-3">
            <h2 className="max-w-[16ch] text-3xl font-semibold leading-[1.1] tracking-tight">
              <span className="text-gradient">Members see more of the department</span>
            </h2>
            <p className="max-w-[40ch] text-[14px] leading-relaxed text-fg-muted">
              Posts need an account to keep discussion tied to real members. Everything else stays open to visitors.
            </p>
          </div>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-fg">Sign in</h1>
        <span className="text-[14px] text-fg-muted">Login to AI &amp; DS Department</span>
      </div>
      <div className="hairline" />

      {error && <Alert>{error}</Alert>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col">
          <span className="field-label">Roll number or email</span>
          <input
            type="text"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            placeholder="Roll number (e.g. 23d102) or email"
            className="field py-3"
          />
        </label>

        <label className="flex flex-col">
          <span className="field-label">Password</span>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
              className="field py-3 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 grid place-items-center px-3 text-fg-muted transition-colors hover:text-fg"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>

        <button type="submit" disabled={loading} className="btn-primary btn-lg mt-2 w-full">
          {loading ? 'Signing in…' : 'Sign in'}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>
    </AuthShell>
  );
};

export default LoginPage;
