import React, { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/useAuth';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [propertyCount, setPropertyCount] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        // Fetch properties
        const propRes = await fetch('/api/properties', { credentials: 'include' });
        const propData = await propRes.json();
        if (propData.success) setPropertyCount(propData.properties.length);
        // Fetch recent transactions
        const txRes = await fetch('/api/transfers/my', { credentials: 'include' });
        const txData = await txRes.json();
        if (txData.success) setRecentTransactions(txData.transfers.slice(0, 5));
      } catch {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="dashboard-bg">
      <Navbar />
      <main className="dashboard-main">
        <h1 className="dashboard-title">Welcome, {user?.email || 'User'}!</h1>
        <p className="dashboard-subtitle">Manage your land assets and transactions with ease.</p>
        {loading ? (
          <div className="dashboard-loading">Loading your dashboard...</div>
        ) : error ? (
          <div className="dashboard-error">{error}</div>
        ) : (
          <>
            <div className="dashboard-stats">
              <div className="dashboard-stat">
                <span className="dashboard-stat-label">Your Properties</span>
                <span className="dashboard-stat-value">{propertyCount}</span>
              </div>
            </div>
            <div className="dashboard-section">
              <h3 className="dashboard-section-title">Recent Transactions</h3>
              {recentTransactions.length === 0 ? (
                <div className="dashboard-empty">No recent transactions.</div>
              ) : (
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Property</th>
                      <th>To</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((t) => (
                      <tr key={t.id}>
                        <td>{t.id}</td>
                        <td>{t.property_address || t.property_id}</td>
                        <td>{t.to_username || t.to_user_id}</td>
                        <td>{t.status}</td>
                        <td>{t.created_at ? new Date(t.created_at).toLocaleString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="dashboard-actions">
              <a href="/properties" className="dashboard-action">View Properties</a>
              <a href="/transfer" className="dashboard-action">Transfer Land</a>
              <a href="/transactions" className="dashboard-action">Transaction History</a>
            </div>
          </>
        )}
      </main>
    </div>
  );
} 