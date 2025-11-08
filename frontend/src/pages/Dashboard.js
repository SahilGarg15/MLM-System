import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { member } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {member?.name}!</h1>
        <p>Member Code: <strong>{member?.member_code}</strong></p>
      </div>

      <div className="dashboard-grid">
        <Link to="/profile" className="dashboard-card">
          <div className="card-icon">👤</div>
          <h2>View Profile</h2>
          <p>See your complete member information and details</p>
          <button className="card-button">View Profile →</button>
        </Link>

        <Link to="/downline" className="dashboard-card">
          <div className="card-icon">🌳</div>
          <h2>My Downline</h2>
          <p>View your left and right team members and counts</p>
          <button className="card-button">View Downline →</button>
        </Link>

        <div className="dashboard-card info-card">
          <div className="card-icon">📊</div>
          <h2>Quick Info</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{member?.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Mobile:</span>
              <span className="info-value">{member?.mobile}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-features">
        <h2>MLM Binary Tree Features</h2>
        <div className="features-grid">
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <div>
              <h3>Binary Tree Structure</h3>
              <p>Each member can have one left and one right downline</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <div>
              <h3>Automatic Spill Logic</h3>
              <p>New members automatically placed in next available position</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <div>
              <h3>Real-time Count Tracking</h3>
              <p>Track total left and right team members instantly</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <div>
              <h3>Sponsor Code System</h3>
              <p>Unique member codes for easy team building</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;