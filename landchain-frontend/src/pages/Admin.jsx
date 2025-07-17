import React, { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/useAuth';
import './Admin.css';

const roles = ['user', 'admin', 'commissioner'];

export default function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ email: '', username: '', role: 'user' });
  const [showDelete, setShowDelete] = useState(null);
  const [actionMsg, setActionMsg] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [propertySearch, setPropertySearch] = useState('');
  const [transferSearch, setTransferSearch] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const [usersRes, propsRes, transRes] = await Promise.all([
          fetch('/api/users', { credentials: 'include' }),
          fetch('/api/properties', { credentials: 'include' }),
          fetch('/api/transfers', { credentials: 'include' })
        ]);
        const usersData = await usersRes.json();
        const propsData = await propsRes.json();
        const transData = await transRes.json();
        if (usersData.success) setUsers(usersData.users);
        if (propsData.success) setProperties(propsData.properties);
        if (transData.success) setTransfers(transData.transfers);
      } catch {
        setError('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    }
    if (user?.role === 'admin') fetchData();
  }, [user, actionMsg]);

  // Edit user handlers
  function openEdit(u) {
    setEditUser(u);
    setEditForm({ email: u.email, username: u.username, role: u.role });
    setActionMsg('');
  }
  function closeEdit() {
    setEditUser(null);
    setEditForm({ email: '', username: '', role: 'user' });
  }
  async function handleEditSubmit(e) {
    e.preventDefault();
    setActionMsg('');
    try {
      const res = await fetch(`/api/users/${editUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg('User updated!');
        closeEdit();
      } else {
        setActionMsg(data.message || 'Update failed');
      }
    } catch {
      setActionMsg('Update failed');
    }
  }
  // Delete user handlers
  function openDelete(u) { setShowDelete(u); setActionMsg(''); }
  function closeDelete() { setShowDelete(null); }
  async function handleDelete() {
    setActionMsg('');
    try {
      const res = await fetch(`/api/users/${showDelete.id}`, {
        method: 'DELETE', credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg('User deleted!');
        closeDelete();
      } else {
        setActionMsg(data.message || 'Delete failed');
      }
    } catch {
      setActionMsg('Delete failed');
    }
  }
  // Change role handler
  async function handleRoleChange(u, newRole) {
    setActionMsg('');
    try {
      const res = await fetch(`/api/users/${u.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (data.success) setActionMsg('Role updated!');
      else setActionMsg(data.message || 'Role update failed');
    } catch {
      setActionMsg('Role update failed');
    }
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-bg">
        <Navbar />
        <main className="admin-main">
          <h2 className="admin-title">Admin Dashboard</h2>
          <div className="admin-error">Access denied. Admins only.</div>
        </main>
      </div>
    );
  }

  // Filtered data
  const filteredUsers = users.filter(u =>
    u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role?.toLowerCase().includes(userSearch.toLowerCase())
  );
  const filteredProperties = properties.filter(p =>
    (p.address || '').toLowerCase().includes(propertySearch.toLowerCase()) ||
    (p.type || '').toLowerCase().includes(propertySearch.toLowerCase()) ||
    (p.status || '').toLowerCase().includes(propertySearch.toLowerCase())
  );
  const filteredTransfers = transfers.filter(t =>
    (t.property_address || '').toLowerCase().includes(transferSearch.toLowerCase()) ||
    (t.from_username || '').toLowerCase().includes(transferSearch.toLowerCase()) ||
    (t.to_username || '').toLowerCase().includes(transferSearch.toLowerCase()) ||
    (t.status || '').toLowerCase().includes(transferSearch.toLowerCase())
  );

  return (
    <div className="admin-bg">
      <Navbar />
      <main className="admin-main">
        <h2 className="admin-title">Admin Dashboard</h2>
        {actionMsg && <div className="admin-action-msg">{actionMsg}</div>}
        {loading ? (
          <div className="admin-loading">Loading admin data...</div>
        ) : error ? (
          <div className="admin-error">{error}</div>
        ) : (
          <>
            <section className="admin-section">
              <h3>All Users</h3>
              <input
                className="admin-search"
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                style={{ marginBottom: 12, width: '100%', maxWidth: 320 }}
              />
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Email</th>
                      <th>Username</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.email}</td>
                        <td>{u.username}</td>
                        <td>
                          <select value={u.role} onChange={e => handleRoleChange(u, e.target.value)}>
                            {roles.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </td>
                        <td>
                          <button className="admin-btn" onClick={() => openEdit(u)}>Edit</button>
                          <button className="admin-btn admin-btn-danger" onClick={() => openDelete(u)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Edit User Modal */}
              {editUser && (
                <div className="admin-modal-bg">
                  <div className="admin-modal">
                    <h4>Edit User</h4>
                    <form onSubmit={handleEditSubmit} className="admin-edit-form">
                      <label>Email
                        <input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} required />
                      </label>
                      <label>Username
                        <input type="text" value={editForm.username} onChange={e => setEditForm(f => ({ ...f, username: e.target.value }))} required />
                      </label>
                      <label>Role
                        <select value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}>
                          {roles.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </label>
                      <div className="admin-modal-actions">
                        <button type="submit" className="admin-btn">Save</button>
                        <button type="button" className="admin-btn admin-btn-secondary" onClick={closeEdit}>Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              {/* Delete User Modal */}
              {showDelete && (
                <div className="admin-modal-bg">
                  <div className="admin-modal">
                    <h4>Delete User</h4>
                    <p>Are you sure you want to delete user <b>{showDelete.email}</b>?</p>
                    <div className="admin-modal-actions">
                      <button className="admin-btn admin-btn-danger" onClick={handleDelete}>Delete</button>
                      <button className="admin-btn admin-btn-secondary" onClick={closeDelete}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </section>
            <section className="admin-section">
              <h3>All Properties</h3>
              <input
                className="admin-search"
                type="text"
                placeholder="Search properties..."
                value={propertySearch}
                onChange={e => setPropertySearch(e.target.value)}
                style={{ marginBottom: 12, width: '100%', maxWidth: 320 }}
              />
              <div className="admin-table-container">
                <table className="admin-table">
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
                    {filteredProperties.map(p => (
                      <tr key={p.property_id || p.id}>
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
            </section>
            <section className="admin-section">
              <h3>All Transfers</h3>
              <input
                className="admin-search"
                type="text"
                placeholder="Search transfers..."
                value={transferSearch}
                onChange={e => setTransferSearch(e.target.value)}
                style={{ marginBottom: 12, width: '100%', maxWidth: 320 }}
              />
              <div className="admin-table-container">
                <table className="admin-table">
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
                    {filteredTransfers.map(t => (
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
            </section>
          </>
        )}
      </main>
    </div>
  );
} 