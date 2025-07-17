import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PropertyDetails.css';

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProperty() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/properties/${id}`);
        const data = await res.json();
        if (data.success) setProperty(data.property);
        else setError(data.message || 'Failed to fetch property');
      } catch {
        setError('Failed to fetch property');
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
  }, [id]);

  return (
    <div className="property-details-bg">
      <div className="property-details-card">
        {loading ? (
          <div className="property-details-loading">Loading property details...</div>
        ) : error ? (
          <div className="property-details-error">{error}</div>
        ) : !property ? (
          <div className="property-details-empty">Property not found.</div>
        ) : (
          <>
            <h2 className="property-details-title">Property Details</h2>
            <div className="property-details-info">
              <div><b>ID:</b> {property.property_id || property.id}</div>
              <div><b>Address:</b> {property.address}</div>
              <div><b>Size:</b> {property.size}</div>
              <div><b>Type:</b> {property.type}</div>
              <div><b>Status:</b> {property.status}</div>
              <div><b>Owner:</b> {property.owner_name || property.owner || '-'}</div>
            </div>
            {/* Ownership history, admin actions, etc. can be added here */}
          </>
        )}
      </div>
    </div>
  );
} 