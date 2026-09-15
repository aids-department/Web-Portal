import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
    <div className="font-brand bg-brand-ground px-5 sm:px-8 lg:px-11 py-8 sm:py-9 lg:py-11">
      <div className="max-w-[980px] mx-auto border border-brand-edge grid grid-cols-1 md:grid-cols-2">
        {/* Info panel */}
        <div className="bg-brand-navy p-8 flex flex-col justify-between gap-8">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-white grid place-items-center">
              <div className="w-2 h-2 bg-brand-red" />
            </div>
            <span className="font-bold text-[12.5px] tracking-[0.14em] text-white">AI &amp; DS</span>
          </div>
          <div className="flex flex-col gap-5">
            <h2 className="m-0 text-[28px] leading-[1.15] font-semibold text-white max-w-[15ch]">
              What an account gives you
            </h2>
            <div className="flex flex-col gap-3.5">
              {BENEFITS.map((b) => (
                <div key={b.title} className="border-t border-[#23345c] pt-3 flex flex-col gap-1">
                  <span className="text-[13.5px] font-medium text-white">{b.title}</span>
                  <span className="text-[12.5px] leading-[1.5] text-brand-on-navy">{b.body}</span>
                </div>
              ))}
            </div>
          </div>
          <span className="text-[11.5px] leading-[1.5] text-brand-on-navy-muted">
            Sign up with your department email so your posts and profile stay tied to a real member.
          </span>
        </div>

        {/* Form panel */}
        <div className="bg-white p-8 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="m-0 text-[30px] font-semibold tracking-[-0.02em] text-brand-navy">Create an account</h1>
            <span className="text-[13px] text-brand-ink-soft">Join the AI &amp; DS Association</span>
          </div>

          {error && (
            <div className="bg-brand-red-tint text-brand-red-deep px-3.5 py-3 text-[13px]">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-brand-blue-tint text-brand-blue px-3.5 py-3 text-[13px]">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Field label="Full name" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="As on the roll list" />
              <Field label="Username" name="username" value={formData.username} onChange={handleChange} placeholder="Choose a username" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Field label="Department email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@aids.dept" />
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-medium tracking-[0.16em] uppercase text-brand-ink-soft">
                  Year of study
                </span>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="border border-brand-ink-faint px-3 py-3 text-[13px] text-brand-ink outline-none focus:border-brand-navy bg-white"
                >
                  <option value="">Select your year</option>
                  {YEAR_OPTIONS.map((y) => (
                    <option key={y.value} value={y.value}>{y.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Field label="Password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="At least 6 characters" />
              <Field label="Confirm" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat it" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="text-left px-[18px] py-3.5 bg-brand-red text-white font-semibold text-[13px] disabled:opacity-50"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div className="border-t border-brand-row pt-4 flex justify-between items-center gap-3 flex-wrap">
            <span className="text-[12.5px] text-brand-ink-soft">Already have one?</span>
            <Link
              to="/login"
              className="text-[12.5px] font-semibold text-brand-blue border-b-2 border-brand-red pb-0.5"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, name, value, onChange, placeholder, type = 'text' }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-[10px] font-medium tracking-[0.16em] uppercase text-brand-ink-soft">
      {label}
    </span>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border border-brand-ink-faint px-3 py-3 text-[13px] text-brand-ink outline-none focus:border-brand-navy"
    />
  </div>
);

export default SignupPage;
