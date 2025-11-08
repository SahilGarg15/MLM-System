import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">MLM Binary Tree</span>
            <br />
            Network Marketing System
          </h1>
          <p className="hero-subtitle">
            Build your network with our powerful Binary Tree structure.
            Each member can have one left and one right downline with automatic spill logic.
          </p>
          <div className="hero-buttons">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary">
                  Join Now
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-illustration">
          <div className="tree-diagram">
            <div className="tree-node root">👤</div>
            <div className="tree-branches">
              <div className="tree-branch left">
                <div className="tree-node">👤</div>
                <div className="tree-subbranches">
                  <div className="tree-node small">👤</div>
                  <div className="tree-node small">👤</div>
                </div>
              </div>
              <div className="tree-branch right">
                <div className="tree-node">👤</div>
                <div className="tree-subbranches">
                  <div className="tree-node small">👤</div>
                  <div className="tree-node small">👤</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🌳</div>
            <h3>Binary Tree Structure</h3>
            <p>Each member can sponsor one left and one right member, creating a balanced network.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Automatic Spill Logic</h3>
            <p>New members automatically placed in the next available position when slots are full.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Real-time Tracking</h3>
            <p>Track your left and right team counts instantly with live updates.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Secure Platform</h3>
            <p>JWT authentication and password encryption for maximum security.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Sponsor System</h3>
            <p>Unique member codes for easy team building and referrals.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Responsive Design</h3>
            <p>Access your network from any device with our mobile-friendly interface.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Register</h3>
            <p>Create your account with a sponsor code or be the first member (root).</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Choose Position</h3>
            <p>Select your preferred position (left or right) under your sponsor.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Get Placed</h3>
            <p>System automatically places you in the best available position.</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Build Network</h3>
            <p>Share your unique member code to grow your left and right teams.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Start Building Your Network?</h2>
        <p>Join thousands of members already growing their MLM business with our platform</p>
        {!isAuthenticated && (
          <Link to="/register" className="btn btn-large">
            Join Now - It's Free!
          </Link>
        )}
      </section>
    </div>
  );
};

export default Home;