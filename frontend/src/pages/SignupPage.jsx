import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AuthShell, { BrandMark } from '../components/ui/AuthShell';
import { Alert } from '../components/ui/States';

const YEAR_OPTIONS = [
  { value: '1', label: '1st Year' },
  { value: '2', label: '2nd Year' },
  { value: '3', label: '3rd Year' },
  { value: '4', label: '4th Year' },
];

const BENEFITS = [
  { title: 'Posts', body: 'Ask anything, anonymously if you prefer.' },
  { title: 'Your profile', body: 'Skills, links and achievements, visible to the department.' },
];

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    year: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.fullName || !formData.username || !formData.email || !formData.password || !formData.year) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('https://web-portal-760h.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          year: formData.year
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        setSuccess('Account created successfully!');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      aside={
        <>
          <BrandMark />
          <div className="flex flex-col gap-6">
            <h2 className="max-w-[15ch] text-3xl font-semibold leading-[1.1] tracking-tight">
              <span className="text-gradient">What an account gives you</span>
            </h2>
            <div className="flex flex-col gap-3">
              {BENEFITS.map((b, i) => (
                <div key={b.title} className="flex gap-3 rounded-xl border border-line bg-white/[0.03] p-4">
                  <span className="grid h-6 w-6 flex-none place-items-center rounded-md bg-accent/15 font-mono text-[11px] text-indigo-200 shadow-[inset_0_0_0_1px_rgba(94,106,210,0.4)]">
                    {i + 1}
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="text-[14px] font-medium text-fg">{b.title}</span>
                    <span className="text-[13px] leading-[1.5] text-fg-muted">{b.body}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <span className="text-[12.5px] leading-[1.5] text-fg-muted">
            Sign up with your department email so your posts and profile stay tied to a real member.
          </span>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-fg">Create an account</h1>
        <span className="text-[14px] text-fg-muted">Join the AI &amp; DS Association</span>
      </div>

      {error && <Alert>{error}</Alert>}
      {success && <Alert tone="success">{success}</Alert>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <Field label="Full name" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="As on the roll list" />
          <Field label="Username" name="username" value={formData.username} onChange={handleChange} placeholder="Choose a username" />
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <Field label="Department email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@aids.dept" />
          <label className="flex flex-col">
            <span className="field-label">Year of study</span>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="field py-3"
            >
              <option value="">Select your year</option>
              {YEAR_OPTIONS.map((y) => (
                <option key={y.value} value={y.value}>{y.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <Field label="Password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="At least 6 characters" />
          <Field label="Confirm" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat it" />
        </div>

        <button type="submit" disabled={loading} className="btn-primary btn-lg mt-2 w-full">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <span className="text-[13px] text-fg-muted">Already have one?</span>
        <Link to="/login" className="btn-ghost btn-sm text-accent-bright">
          Sign in
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </AuthShell>
  );
};

const Field = ({ label, name, value, onChange, placeholder, type = 'text' }) => (
  <label className="flex flex-col">
    <span className="field-label">{label}</span>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="field py-3"
    />
  </label>
);

export default SignupPage;
