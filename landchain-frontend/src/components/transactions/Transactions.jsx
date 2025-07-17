import React, { useEffect, useState } from 'react';
import './Transactions.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch('/api/transfers/my', { credentials: 'include' });
        const data = await res.json();
        if (data.success) {
          setTransactions(data.transfers);
        } else {
          setError(data.message || 'Failed to fetch transactions');
        }
      } catch {
        setError('Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  return (
    <div className="transactions-bg">
      <div className="transactions-card">
        <h2 className="transactions-title">Transaction History</h2>
        {loading ? (
          <div className="transactions-loading">Loading transactions...</div>
        ) : error ? (
          <div className="transactions-error">{error}</div>
        ) : transactions.length === 0 ? (
          <div className="transactions-empty">No transactions found.</div>
        ) : (
          <div className="transactions-table-container">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Property</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.property_address || t.property_id}</td>
                    <td>{t.from_username || t.from_user_id}</td>
                    <td>{t.to_username || t.to_user_id}</td>
                    <td>{t.status}</td>
                    <td>{t.created_at ? new Date(t.created_at).toLocaleString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;