import React, { useState, useEffect } from 'react';
import { memberAPI } from '../services/api';
import './Downline.css';

const Downline = () => {
  const [downlineData, setDownlineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('left');

  useEffect(() => {
    loadDownline();
  }, []);

  const loadDownline = async () => {
    try {
      setLoading(true);
      const response = await memberAPI.getDownline();
      setDownlineData(response.data);
    } catch (error) {
      console.error('Error loading downline:', error);
      setError('Failed to load downline data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading downline data...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="downline-container">
      <div className="downline-header">
        <h1>My Downline Members</h1>
        <p>View and manage your binary tree network</p>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card left-card">
          <div className="summary-icon">👈</div>
          <div className="summary-info">
            <h2>{downlineData?.total_left || 0}</h2>
            <p>Total Left Members</p>
          </div>
        </div>
        <div className="summary-card right-card">
          <div className="summary-icon">👉</div>
          <div className="summary-info">
            <h2>{downlineData?.total_right || 0}</h2>
            <p>Total Right Members</p>
          </div>
        </div>
        <div className="summary-card total-card">
          <div className="summary-icon">🌟</div>
          <div className="summary-info">
            <h2>{(downlineData?.total_left || 0) + (downlineData?.total_right || 0)}</h2>
            <p>Total Team Size</p>
          </div>
        </div>
      </div>

      {/* Direct Members */}
      <div className="direct-members-section">
        <h2>Direct Members</h2>
        <div className="direct-members-container">
          <div className="direct-member-box left">
            <h3>Left Position</h3>
            {downlineData?.direct_left ? (
              <div className="member-info-card">
                <div className="member-avatar">{downlineData.direct_left.name.charAt(0)}</div>
                <div className="member-details">
                  <h4>{downlineData.direct_left.name}</h4>
                  <p className="member-code">{downlineData.direct_left.member_code}</p>
                  <p className="member-email">{downlineData.direct_left.email}</p>
                  <p className="member-mobile">{downlineData.direct_left.mobile}</p>
                  <div className="member-stats">
                    <span>👈 {downlineData.direct_left.left_count}</span>
                    <span>👉 {downlineData.direct_left.right_count}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-position">
                <p>No member in left position</p>
                <small>Share your member code to fill this position</small>
              </div>
            )}
          </div>

          <div className="direct-member-box right">
            <h3>Right Position</h3>
            {downlineData?.direct_right ? (
              <div className="member-info-card">
                <div className="member-avatar">{downlineData.direct_right.name.charAt(0)}</div>
                <div className="member-details">
                  <h4>{downlineData.direct_right.name}</h4>
                  <p className="member-code">{downlineData.direct_right.member_code}</p>
                  <p className="member-email">{downlineData.direct_right.email}</p>
                  <p className="member-mobile">{downlineData.direct_right.mobile}</p>
                  <div className="member-stats">
                    <span>👈 {downlineData.direct_right.left_count}</span>
                    <span>👉 {downlineData.direct_right.right_count}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-position">
                <p>No member in right position</p>
                <small>Share your member code to fill this position</small>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'left' ? 'active' : ''}`}
          onClick={() => setActiveTab('left')}
        >
          👈 Left Team ({downlineData?.left_downline?.length || 0})
        </button>
        <button
          className={`tab-button ${activeTab === 'right' ? 'active' : ''}`}
          onClick={() => setActiveTab('right')}
        >
          👉 Right Team ({downlineData?.right_downline?.length || 0})
        </button>
      </div>

      {/* Downline List */}
      <div className="downline-list-section">
        {activeTab === 'left' ? (
          <div className="downline-list">
            {downlineData?.left_downline?.length > 0 ? (
              <>
                <h3>Left Team Members ({downlineData.left_downline.length})</h3>
                <div className="members-grid">
                  {downlineData.left_downline.map((member) => (
                    <div key={member.member_code} className="member-card">
                      <div className="member-card-header">
                        <div className="member-avatar-sm">{member.name.charAt(0)}</div>
                        <div>
                          <h4>{member.name}</h4>
                          <p className="member-code-sm">{member.member_code}</p>
                        </div>
                      </div>
                      <div className="member-card-body">
                        <p><strong>Email:</strong> {member.email}</p>
                        <p><strong>Mobile:</strong> {member.mobile}</p>
                        <p><strong>Position:</strong> <span className="capitalize">{member.position}</span></p>
                        <p><strong>Joined:</strong> {new Date(member.joining_date).toLocaleDateString()}</p>
                        <div className="member-card-stats">
                          <span>👈 Left: {member.left_count}</span>
                          <span>👉 Right: {member.right_count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-team">
                <p>No members in your left team yet</p>
                <small>Share your member code to build your left team</small>
              </div>
            )}
          </div>
        ) : (
          <div className="downline-list">
            {downlineData?.right_downline?.length > 0 ? (
              <>
                <h3>Right Team Members ({downlineData.right_downline.length})</h3>
                <div className="members-grid">
                  {downlineData.right_downline.map((member) => (
                    <div key={member.member_code} className="member-card">
                      <div className="member-card-header">
                        <div className="member-avatar-sm">{member.name.charAt(0)}</div>
                        <div>
                          <h4>{member.name}</h4>
                          <p className="member-code-sm">{member.member_code}</p>
                        </div>
                      </div>
                      <div className="member-card-body">
                        <p><strong>Email:</strong> {member.email}</p>
                        <p><strong>Mobile:</strong> {member.mobile}</p>
                        <p><strong>Position:</strong> <span className="capitalize">{member.position}</span></p>
                        <p><strong>Joined:</strong> {new Date(member.joining_date).toLocaleDateString()}</p>
                        <div className="member-card-stats">
                          <span>👈 Left: {member.left_count}</span>
                          <span>👉 Right: {member.right_count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-team">
                <p>No members in your right team yet</p>
                <small>Share your member code to build your right team</small>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Downline;