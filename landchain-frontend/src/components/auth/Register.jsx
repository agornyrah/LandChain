import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Register.css';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  return (
    <div className="register-bg">
      <div className="register-card">
        <h2 className="register-title">Create Your Account</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError('');
            setSuccess('');
            setLoading(true);
            const form = e.target;
            const fullname = form.fullname.value;
            const email = form.email.value;
            const phone = form.phone.value;
            const address = form.address.value;
            const password = form.password.value;
            const confirm = form.confirm.value;
            if (password !== confirm) {
              setError('Passwords do not match');
              setLoading(false);
              return;
            }
            try {
              const res = await api.post('/auth/register', { 
                fullname, 
                email, 
                phone, 
                address, 
                password 
              });
              const data = res.data;
              if (data.success) {
                setSuccess('Registration successful! Redirecting to login...');
                form.reset();
                setTimeout(() => {
                  navigate('/login');
                }, 1500);
              } else {
                setError(data.message || 'Registration failed');
              }
            } catch (err) {
              setError(err.response?.data?.message || 'Error registering. Please try again.');
            } finally {
              setLoading(false);
            }
          }}
          className="register-form"
        >
          <label className="register-label">
            Full Name
            <input type="text" name="fullname" required autoComplete="name" className="register-input" />
          </label>
          <label className="register-label">
            Email
            <input type="email" name="email" required autoComplete="username" className="register-input" />
          </label>
          <label className="register-label">
            Phone
            <input type="tel" name="phone" required autoComplete="tel" className="register-input" />
          </label>
          <label className="register-label">
            Address
            <input type="text" name="address" required autoComplete="street-address" className="register-input" />
          </label>
          <label className="register-label">
            Password
            <input type="password" name="password" required autoComplete="new-password" className="register-input" minLength={6} />
          </label>
          <label className="register-label">
            Confirm Password
            <input type="password" name="confirm" required autoComplete="new-password" className="register-input" minLength={6} />
          </label>
          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
          {error && <div className="register-error">{error}</div>}
          {success && <div className="register-success">{success}</div>}
        </form>
        <div className="register-footer">
          Already have an account? <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Login</a>
        </div>
      </div>
    </div>
  );
};

export default Register;