import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProperties: 0,
    pendingTransactions: 0,
    completedTransactions: 0,
    totalUsers: 0
  });
  const [recentProperties, setRecentProperties] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch statistics
      const [propertiesRes, transactionsRes, usersRes] = await Promise.all([
        api.get('/properties'),
        api.get('/transactions'),
        api.get('/users')
      ]);

      // Calculate stats
      const properties = propertiesRes.data || [];
      const transactions = transactionsRes.data || [];
      const users = usersRes.data || [];

      setStats({
        totalProperties: properties.length,
        pendingTransactions: transactions.filter(t => t.status === 'pending').length,
        completedTransactions: transactions.filter(t => t.status === 'completed').length,
        totalUsers: users.length
      });

      // Get recent items
      setRecentProperties(properties.slice(-5).reverse());
      setRecentTransactions(transactions.slice(-5).reverse());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'add-property':
        navigate('/property');
        break;
      case 'view-transactions':
        navigate('/transactions');
        break;
      case 'view-map':
        navigate('/map');
        break;
      case 'blockchain':
        navigate('/blockchain');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.fullname || user?.email || 'User'}!</h1>
        <p className="dashboard-subtitle">Here's an overview of your land registry activities</p>
      </div>

      {error && <div className="dashboard-error">{error}</div>}

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🏠</div>
          <h3>Total Properties</h3>
          <p className="stat-number">{stats.totalProperties}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <h3>Pending Transactions</h3>
          <p className="stat-number">{stats.pendingTransactions}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <h3>Completed Transactions</h3>
          <p className="stat-number">{stats.completedTransactions}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <h3>Total Users</h3>
          <p className="stat-number">{stats.totalUsers}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button 
            className="action-btn primary"
            onClick={() => handleQuickAction('add-property')}
          >
            <span className="action-icon">➕</span>
            Add Property
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => handleQuickAction('view-transactions')}
          >
            <span className="action-icon">📋</span>
            View Transactions
          </button>
          <button 
            className="action-btn info"
            onClick={() => handleQuickAction('view-map')}
          >
            <span className="action-icon">🗺️</span>
            View Map
          </button>
          <button 
            className="action-btn success"
            onClick={() => handleQuickAction('blockchain')}
          >
            <span className="action-icon">🔗</span>
            Blockchain Explorer
          </button>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="recent-activities">
        <div className="recent-section">
          <h2>Recent Properties</h2>
          {recentProperties.length > 0 ? (
            <div className="recent-list">
              {recentProperties.map((property) => (
                <div key={property.id} className="recent-item">
                  <div className="item-info">
                    <h4>{property.landTitle}</h4>
                    <p>Owner: {property.owner}</p>
                  </div>
                  <button 
                    className="view-btn"
                    onClick={() => navigate(`/property/${property.id}`)}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No properties yet</p>
          )}
        </div>

        <div className="recent-section">
          <h2>Recent Transactions</h2>
          {recentTransactions.length > 0 ? (
            <div className="recent-list">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="recent-item">
                  <div className="item-info">
                    <h4>Transaction #{transaction.id}</h4>
                    <p>Status: <span className={`status ${transaction.status}`}>{transaction.status}</span></p>
                  </div>
                  <button 
                    className="view-btn"
                    onClick={() => navigate('/transactions')}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No transactions yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;