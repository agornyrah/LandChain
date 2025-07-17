import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setUser(data.user || null));
  }, []);

  if (user === undefined) return <div>Loading...</div>;
  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return <Navigate to="/login" />;
  }
  return children;
}