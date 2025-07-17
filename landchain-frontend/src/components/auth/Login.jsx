import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import './Login.css';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

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
              const res = await api.post('/auth/login', { email, password });
              const data = res.data;
              if (data.success) {
                setSuccess('Login successful! Redirecting...');
                login(data.user);
                setTimeout(() => {
                  navigate('/dashboard');
                }, 1200);
              } else {
                setError(data.message || 'Login failed');
              }
            } catch (err) {
              setError(err.response?.data?.message || 'Error logging in. Please try again.');
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