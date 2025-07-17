import React, { useEffect, useState } from 'react';
import './Transfer.css';

export default function Transfer() {
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [propertyId, setPropertyId] = useState('');
  const [toUserId, setToUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Fetch user's properties
  useEffect(() => {
    async function fetchData() {
      try {
        const propRes = await fetch('/api/properties', { credentials: 'include' });
        const propData = await propRes.json();
        if (propData.success) setProperties(propData.properties);
        const userRes = await fetch('/api/users', { credentials: 'include' });
        const userData = await userRes.json();
        if (userData.success) setUsers(userData.users);
      } catch {
        setError('Failed to load data');
      }
    }
    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ property_id: propertyId, to_user_id: toUserId })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Transfer request submitted!');
        setPropertyId('');
        setToUserId('');
      } else {
        setError(data.error || data.message || 'Transfer failed');
      }
    } catch {
      setError('Transfer failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="transfer-bg">
      <div className="transfer-card">
        <h2 className="transfer-title">Transfer Land Ownership</h2>
        <form className="transfer-form" onSubmit={handleSubmit}>
          <label className="transfer-label">
            Select Property
            <select value={propertyId} onChange={e => setPropertyId(e.target.value)} required className="transfer-input">
              <option value="">-- Select --</option>
              {properties.map(p => (
                <option key={p.property_id || p.id} value={p.property_id || p.id}>
                  {p.address} (ID: {p.property_id || p.id})
                </option>
              ))}
            </select>
          </label>
          <label className="transfer-label">
            Transfer To
            <select value={toUserId} onChange={e => setToUserId(e.target.value)} required className="transfer-input">
              <option value="">-- Select --</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.email || u.username || u.id}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="transfer-btn" disabled={loading}>
            {loading ? 'Transferring...' : 'Submit Transfer'}
          </button>
          {error && <div className="transfer-error">{error}</div>}
          {success && <div className="transfer-success">{success}</div>}
        </form>
      </div>
    </div>
  );
} 