import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  return (
    <div className="login-bg">
      <div className="login-card">
        <h2 className="login-title">Sign In to LandChain</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError('');
            setSuccess('');
            setLoading(true);
            const form = e.target;
            const email = form.email.value;
            const password = form.password.value;
            try {
              const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
              });
              const data = await res.json();
              if (data.success) {
                setSuccess('Login successful! Redirecting...');
                setTimeout(() => {
                  window.location.href = '/dashboard';
                }, 1200);
              } else {
                setError(data.message || 'Login failed');
              }
            } catch {
              setError('Error logging in. Please try again.');
            } finally {
              setLoading(false);
            }
          }}
          className="login-form"
        >
          <label className="login-label">
            Email
            <input type="email" name="email" required autoComplete="username" className="login-input" />
          </label>
          <label className="login-label">
            Password
            <input type="password" name="password" required autoComplete="current-password" className="login-input" />
          </label>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
          {error && <div className="login-error">{error}</div>}
          {success && <div className="login-success">{success}</div>}
        </form>
        <div className="login-footer">
          Don&apos;t have an account? <a href="/register">Register</a>
        </div>
      </div>
    </div>
  );
};

export default Login;