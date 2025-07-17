import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import './Profile.css';

export default function Profile() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setEmail(user?.email || '');
  }, [user]);

  async function handleUpdate(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password: password || undefined })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Profile updated!');
        login(data.user); // update context
        setPassword('');
      } else {
        setError(data.message || 'Update failed');
      }
    } catch {
      setError('Update failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="profile-bg">
      <div className="profile-card">
        <h2 className="profile-title">Profile & Settings</h2>
        <form className="profile-form" onSubmit={handleUpdate}>
          <label className="profile-label">
            Email
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="profile-input" />
          </label>
          <label className="profile-label">
            New Password
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="profile-input" minLength={6} placeholder="Leave blank to keep current password" />
          </label>
          <button type="submit" className="profile-btn" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
          {error && <div className="profile-error">{error}</div>}
          {success && <div className="profile-success">{success}</div>}
        </form>
      </div>
    </div>
  );
} 