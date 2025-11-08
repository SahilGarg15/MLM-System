import React, { useState, useEffect } from 'react';
import { memberAPI } from '../services/api';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await memberAPI.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {profile?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1>{profile?.name}</h1>
          <p className="member-code">Member Code: {profile?.member_code}</p>
        </div>
      </div>

      <div className="profile-sections">
        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="profile-grid">
            <div className="profile-item">
              <span className="profile-label">Full Name</span>
              <span className="profile-value">{profile?.name}</span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Email</span>
              <span className="profile-value">{profile?.email}</span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Mobile Number</span>
              <span className="profile-value">{profile?.mobile}</span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Member Code</span>
              <span className="profile-value highlight">{profile?.member_code}</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Network Information</h2>
          <div className="profile-grid">
            <div className="profile-item">
              <span className="profile-label">Sponsor Code</span>
              <span className="profile-value">
                {profile?.sponsor_code || 'Root Member (No Sponsor)'}
              </span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Position</span>
              <span className="profile-value capitalize">{profile?.position || 'Root'}</span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Joining Date</span>
              <span className="profile-value">
                {new Date(profile?.joining_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Team Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card left">
              <div className="stat-icon">👈</div>
              <div className="stat-info">
                <h3>{profile?.left_count || 0}</h3>
                <p>Left Team Members</p>
              </div>
            </div>
            <div className="stat-card right">
              <div className="stat-icon">👉</div>
              <div className="stat-info">
                <h3>{profile?.right_count || 0}</h3>
                <p>Right Team Members</p>
              </div>
            </div>
            <div className="stat-card total">
              <div className="stat-icon">🌟</div>
              <div className="stat-info">
                <h3>{(profile?.left_count || 0) + (profile?.right_count || 0)}</h3>
                <p>Total Team Members</p>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Direct Members</h2>
          <div className="direct-members-grid">
            <div className="direct-member-card">
              <h3>Left Position</h3>
              {profile?.left_member ? (
                <div className="member-badge filled">
                  <span>✓</span>
                  <p>{profile.left_member}</p>
                </div>
              ) : (
                <div className="member-badge empty">
                  <span>○</span>
                  <p>Available</p>
                </div>
              )}
            </div>
            <div className="direct-member-card">
              <h3>Right Position</h3>
              {profile?.right_member ? (
                <div className="member-badge filled">
                  <span>✓</span>
                  <p>{profile.right_member}</p>
                </div>
              ) : (
                <div className="member-badge empty">
                  <span>○</span>
                  <p>Available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;