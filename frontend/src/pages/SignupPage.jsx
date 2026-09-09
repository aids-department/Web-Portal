import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import Field from '../components/ui/Field';
import Button from '../components/ui/Button';

const VALUE_PROPS = [
  { title: 'The alumni directory', body: 'Search profiles by company, city and skill.' },
  { title: 'Posts', body: 'Ask anything, anonymously if you prefer.' },
  { title: 'The question bank', body: 'Past papers, notes and question banks, with upload rights.' },
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
    <>
      <SiteNav />
      <div className="min-h-screen bg-ds-ground flex items-center justify-center px-gutter-mobile sm:px-gutter pt-16 py-10">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-[1fr_440px] border border-ds-edge">

          {/* Value panel */}
          <div className="bg-navy px-9 py-9 flex flex-col justify-between gap-10">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 bg-white flex items-center justify-center">
                <div className="w-2 h-2 bg-ds-red" />
              </div>
              <span className="text-label font-bold tracking-label text-white">AI &amp; DS</span>
            </div>
            <div className="flex flex-col gap-6">
              <h2 className="text-section-heading text-white max-w-[15ch]">What an account gives you</h2>
              <div className="flex flex-col gap-4">
                {VALUE_PROPS.map((v) => (
                  <div key={v.title} className="border-t border-blue pt-3 flex flex-col gap-1">
                    <span className="text-label font-medium text-white">{v.title}</span>
                    <span className="text-body text-on-navy-muted">{v.body}</span>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-label text-on-navy-muted">
              Accounts are verified against the department roll list.
            </span>
          </div>

          {/* Form panel */}
          <div className="bg-white px-9 py-9 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-section-heading text-navy">Create an account</h1>
              <p className="text-body text-ds-ink-soft">Takes a minute. Verification is usually same day.</p>
            </div>

            {error && (
              <div className="bg-ds-red-tint border-t-2 border-ds-red text-ds-red-deep px-4 py-3 text-body flex items-center">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-ds-blue-tint border-t-2 border-ds-blue text-ds-blue px-4 py-3 text-body flex items-center">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <Field.Label htmlFor="fullName">Full name</Field.Label>
                  <Field.Input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="As on the roll list"
                  />
                </div>
                <div>
                  <Field.Label htmlFor="username">Username</Field.Label>
                  <Field.Input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                  />
                </div>
              </div>

              <div>
                <Field.Label htmlFor="email">Department email</Field.Label>
                <Field.Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@aids.dept"
                />
              </div>

              <div>
                <Field.Label htmlFor="year">Year of study</Field.Label>
                <Field.Select id="year" name="year" value={formData.year} onChange={handleChange}>
                  <option value="">Select your year</option>
                  <option value="1">1st year</option>
                  <option value="2">2nd year</option>
                  <option value="3">3rd year</option>
                  <option value="4">4th year</option>
                </Field.Select>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <Field.Label htmlFor="password">Password</Field.Label>
                  <Field.Input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                  />
                </div>
                <div>
                  <Field.Label htmlFor="confirmPassword">Confirm</Field.Label>
                  <Field.Input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat it"
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" disabled={loading} className="w-full justify-center">
                {loading ? 'Creating account…' : 'Create account'}
              </Button>
            </form>

            <div className="border-t border-ds-row pt-4 flex justify-between items-center">
              <span className="text-body text-ds-ink-soft">Already have one?</span>
              <Link to="/login" className="text-label font-semibold text-ds-blue border-b-2 border-ds-red pb-0.5">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
