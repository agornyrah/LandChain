import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-bg">
      <nav className="home-navbar">
        <div className="home-logo">LandChain</div>
        <div className="home-navlinks">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </nav>
      <main className="home-hero">
        <div className="home-hero-content">
          <h1 className="home-title">Modern Land Registration & Management</h1>
          <p className="home-subtitle">Secure, transparent, and efficient land records powered by blockchain technology.</p>
          <div className="home-cta-group">
            <Link to="/register" className="home-cta-primary">Get Started</Link>
            <Link to="/login" className="home-cta-secondary">Login</Link>
          </div>
        </div>
        <div className="home-features">
          <div className="home-feature">
            <span className="home-feature-icon">🔒</span>
            <h3>Secure Records</h3>
            <p>All land records are cryptographically secured and tamper-proof.</p>
          </div>
          <div className="home-feature">
            <span className="home-feature-icon">⚡</span>
            <h3>Instant Transfers</h3>
            <p>Transfer property ownership quickly and transparently.</p>
          </div>
          <div className="home-feature">
            <span className="home-feature-icon">🌍</span>
            <h3>Accessible Anywhere</h3>
            <p>Manage your land assets from any device, anytime.</p>
          </div>
        </div>
      </main>
    </div>
  );
}