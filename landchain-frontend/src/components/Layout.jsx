import React from 'react';
import { Link } from 'react-router-dom';

export default function Layout({ children }) {
  return (
    <div>
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="font-bold text-xl text-[#53d22c]">LandChain</div>
        <div className="space-x-4">
          <Link to="/user-dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/profile" className="hover:underline">Profile</Link>
          <Link to="/support" className="hover:underline">Support</Link>
          <Link to="/settings" className="hover:underline">Settings</Link>
          <LogoutButton />
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}

function LogoutButton() {
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/login';
  };
  return (
    <button onClick={handleLogout} className="text-red-600 hover:underline ml-2">
      Logout
    </button>
  );
}