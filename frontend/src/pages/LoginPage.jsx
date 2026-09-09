import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import HeroCanvas from '../components/HeroCanvas';
import Field from '../components/ui/Field';
import Button from '../components/ui/Button';

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
      const response = await fetch('https://web-portal-760h.onrender.com/api/auth/login', {
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
    <>
      <SiteNav />
      <div className="min-h-screen bg-ds-ground flex items-center justify-center px-gutter-mobile sm:px-gutter pt-16 py-10">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-[1fr_400px] min-h-[520px] border border-ds-edge">

          {/* Value panel */}
          <div className="relative bg-navy-deep flex flex-col justify-between p-9 overflow-hidden">
            <div className="relative z-10 flex items-center gap-2.5">
              <div className="w-6 h-6 bg-white flex items-center justify-center">
                <div className="w-2 h-2 bg-ds-red" />
              </div>
              <span className="text-label font-bold tracking-label text-white">AI &amp; DS</span>
            </div>
            <div className="absolute inset-0">
              <HeroCanvas width={520} height={300} staticVariant />
            </div>
            <div className="relative z-10 flex flex-col gap-3">
              <h2 className="text-section-heading text-white max-w-[16ch]">
                Members see more of the department
              </h2>
              <p className="text-body text-on-navy max-w-[40ch]">
                Posts, the alumni directory and the question bank need an account. Everything else stays open to visitors.
              </p>
            </div>
          </div>

          {/* Form panel */}
          <div className="bg-white p-9 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h1 className="text-section-heading text-navy">Sign in</h1>
              <p className="text-body text-ds-ink-soft">Use your department address.</p>
            </div>
            <div className="h-0.5 bg-navy" />

            {error && (
              <div className="bg-ds-red-tint border-t-2 border-ds-red text-ds-red-deep px-4 py-3 text-body">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <Field.Label htmlFor="identifier">Username or email</Field.Label>
                <Field.Input
                  id="identifier"
                  type="text"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  placeholder="Enter username or email"
                />
              </div>

              <div>
                <Field.Label htmlFor="password">Password</Field.Label>
                <Field.Input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
              </div>

              <Button type="submit" variant="primary" disabled={loading} className="w-full justify-center">
                {loading ? 'Logging in…' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-auto border-t border-ds-row pt-4 flex justify-between items-center">
              <span className="text-body text-ds-ink-soft">New here?</span>
              <Link to="/signup" className="text-label font-semibold text-ds-blue border-b-2 border-ds-red pb-0.5">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
