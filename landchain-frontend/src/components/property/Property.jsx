import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Property.css';

const Property = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    landTitle: '',
    owner: '',
    gpsCoordinates: '',
    address: '',
    size: '',
    type: 'residential',
    status: 'active'
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    try {
      setLoading(true);
      const res = await api.get('/properties');
      const data = res.data;
      if (Array.isArray(data)) {
        setProperties(data);
      } else if (data.properties) {
        setProperties(data.properties);
      } else {
        setProperties([]);
      }
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch properties');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }

  function handleRowClick(id) {
    navigate(`/property/${id}`);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await api.post('/properties', formData);
      if (res.data.success || res.data.id) {
        setShowAddForm(false);
        setFormData({
          landTitle: '',
          owner: '',
          gpsCoordinates: '',
          address: '',
          size: '',
          type: 'residential',
          status: 'active'
        });
        await fetchProperties();
      } else {
        setError(res.data.message || 'Failed to add property');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add property');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="property-container">
      <div className="property-header">
        <h2 className="property-title">Properties Management</h2>
        <button 
          className="add-property-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add Property'}
        </button>
      </div>

      {error && <div className="property-error">{error}</div>}

      {showAddForm && (
        <div className="property-form-container">
          <h3>Add New Property</h3>
          <form onSubmit={handleSubmit} className="property-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="landTitle">Land Title</label>
                <input
                  type="text"
                  id="landTitle"
                  name="landTitle"
                  value={formData.landTitle}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter land title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="owner">Owner</label>
                <input
                  type="text"
                  id="owner"
                  name="owner"
                  value={formData.owner}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter owner name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="gpsCoordinates">GPS Coordinates</label>
                <input
                  type="text"
                  id="gpsCoordinates"
                  name="gpsCoordinates"
                  value={formData.gpsCoordinates}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 1.2345, -1.2345"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter property address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="size">Size</label>
                <input
                  type="text"
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 500 sqm"
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="agricultural">Agricultural</option>
                  <option value="industrial">Industrial</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-property-btn"
              disabled={submitting}
            >
              {submitting ? 'Adding...' : 'Add Property'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="property-loading">
          <div className="spinner"></div>
          <p>Loading properties...</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="property-empty">
          <p>No properties found.</p>
          <button 
            className="add-first-property-btn"
            onClick={() => setShowAddForm(true)}
          >
            Add Your First Property
          </button>
        </div>
      ) : (
        <div className="property-table-container">
          <table className="property-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Land Title</th>
                <th>Address</th>
                <th>Size</th>
                <th>Type</th>
                <th>Owner</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr
                  key={p.id}
                  className="property-row-clickable"
                  onClick={() => handleRowClick(p.id)}
                >
                  <td>{p.id}</td>
                  <td>{p.landTitle || '-'}</td>
                  <td>{p.address || '-'}</td>
                  <td>{p.size || '-'}</td>
                  <td>{p.type || '-'}</td>
                  <td>{p.owner || '-'}</td>
                  <td>
                    <span className={`status-badge ${p.status || 'active'}`}>
                      {p.status || 'active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Property;