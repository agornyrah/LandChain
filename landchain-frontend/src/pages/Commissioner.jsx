import React, { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/useAuth';
import './Commissioner.css';

export default function Commissioner() {
  const { user } = useAuth();
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    async function fetchPending() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/transfers/pending', { credentials: 'include' });
        const data = await res.json();
        if (data.success) setPendingTransfers(data.transfers);
        else setError(data.message || 'Failed to fetch pending transfers');
      } catch {
        setError('Failed to fetch pending transfers');
      } finally {
        setLoading(false);
      }
    }
    if (user?.role === 'commissioner') fetchPending();
  }, [user, actionMsg]);

  async function handleApprove(id) {
    setActionMsg('');
    try {
      const res = await fetch(`/api/transfers/${id}/approve`, {
        method: 'PATCH', credentials: 'include'
      });
      const data = await res.json();
      if (data.success) setActionMsg('Transfer approved!');
      else setActionMsg(data.message || 'Approval failed');
    } catch {
      setActionMsg('Approval failed');
    }
  }

  if (!user || user.role !== 'commissioner') {
    return (
      <div className="commissioner-bg">
        <Navbar />
        <main className="commissioner-main">
          <h2 className="commissioner-title">Commissioner Dashboard</h2>
          <div className="commissioner-error">Access denied. Commissioners only.</div>
        </main>
      </div>
    );
  }

  return (
    <div className="commissioner-bg">
      <Navbar />
      <main className="commissioner-main">
        <h2 className="commissioner-title">Commissioner Dashboard</h2>
        {actionMsg && <div className="commissioner-action-msg">{actionMsg}</div>}
        {loading ? (
          <div className="commissioner-loading">Loading pending transfers...</div>
        ) : error ? (
          <div className="commissioner-error">{error}</div>
        ) : (
          <>
            <section className="commissioner-section">
              <h3>Pending Transfers</h3>
              <div className="commissioner-table-container">
                <table className="commissioner-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Property</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingTransfers.length === 0 ? (
                      <tr><td colSpan={7} className="commissioner-empty">No pending transfers.</td></tr>
                    ) : pendingTransfers.map(t => (
                      <tr key={t.id}>
                        <td>{t.id}</td>
                        <td>{t.address || t.property_id}</td>
                        <td>{t.from_username || t.from_user_id}</td>
                        <td>{t.to_username || t.to_user_id}</td>
                        <td>{t.status}</td>
                        <td>{t.created_at ? new Date(t.created_at).toLocaleString() : '-'}</td>
                        <td>
                          <button className="commissioner-btn" onClick={() => handleApprove(t.id)}>Approve</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
} 