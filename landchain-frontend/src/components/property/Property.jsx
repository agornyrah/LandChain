import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Property.css';

const Property = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch('/api/properties');
        const data = await res.json();
        if (data.success) {
          setProperties(data.properties);
        } else {
          setError(data.message || 'Failed to fetch properties');
        }
      } catch {
        setError('Failed to fetch properties');
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  function handleRowClick(id) {
    navigate(`/property/${id}`);
  }

  return (
    <div className="property-bg">
      <div className="property-card">
        <h2 className="property-title">Properties</h2>
        {loading ? (
          <div className="property-loading">Loading properties...</div>
        ) : error ? (
          <div className="property-error">{error}</div>
        ) : properties.length === 0 ? (
          <div className="property-empty">No properties found.</div>
        ) : (
          <div className="property-table-container">
            <table className="property-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Address</th>
                  <th>Size</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Owner</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr
                    key={p.property_id || p.id}
                    className="property-row-clickable"
                    onClick={() => handleRowClick(p.property_id || p.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{p.property_id || p.id}</td>
                    <td>{p.address}</td>
                    <td>{p.size}</td>
                    <td>{p.type}</td>
                    <td>{p.status}</td>
                    <td>{p.owner_name || p.owner || '-'}</td>
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

export default Property;