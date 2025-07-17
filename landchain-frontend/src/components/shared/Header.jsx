import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import './Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if backend logout fails, clear local state
      logout();
      navigate('/');
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <Link to="/" className="logo" onClick={closeMobileMenu}>
          <span className="logo-icon">🏛️</span>
          <span className="logo-text">LandChain</span>
        </Link>

        <nav className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link" onClick={closeMobileMenu}>
                Dashboard
              </Link>
              <Link to="/property" className="nav-link" onClick={closeMobileMenu}>
                Properties
              </Link>
              <Link to="/transactions" className="nav-link" onClick={closeMobileMenu}>
                Transactions
              </Link>
              <Link to="/map" className="nav-link" onClick={closeMobileMenu}>
                Map
              </Link>
              <Link to="/blockchain" className="nav-link" onClick={closeMobileMenu}>
                Blockchain
              </Link>
              <div className="user-menu">
                <span className="user-name">👤 {user.email}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/" className="nav-link" onClick={closeMobileMenu}>
                Home
              </Link>
              <Link to="/login" className="nav-link" onClick={closeMobileMenu}>
                Login
              </Link>
              <Link to="/register" className="nav-link register-btn" onClick={closeMobileMenu}>
                Get Started
              </Link>
            </>
          )}
        </nav>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span className="hamburger"></span>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;