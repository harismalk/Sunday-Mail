import React, { useState } from 'react';
import './TopBar.css';

export default function TopBar({ userName, userEmail, onLogout }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const hours = new Date().getHours();
  let greeting = 'Good afternoon';
  if (hours < 12) greeting = 'Good morning';
  else if (hours >= 17) greeting = 'Good evening';

  const getGreetingIcon = () => {
    if (hours < 12) return '🌅';
    if (hours < 17) return '☀️';
    return '🌙';
  };

  return (
    <div className="topbar">
      <div className="topbar-content">
        {/* Greeting Section - fill available space */}
        <div className="topbar-greeting-fill">
          <div className="greeting-container">
            <div className="greeting-icon">
              <span className="greeting-emoji">{getGreetingIcon()}</span>
              <div className="greeting-glow"></div>
            </div>
            <div className="greeting-text">
              <h2 className="greeting-title">{greeting}, {userName}</h2>
              <p className="greeting-subtitle">Welcome back to your automation dashboard</p>
            </div>
          </div>
        </div>
        {/* Profile Section */}
        <div className="topbar-right">
          <div className="profile-container">
            <button 
              className="profile-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="profile-avatar">
                <span className="avatar-text">{userName.charAt(0).toUpperCase()}</span>
                <div className="avatar-ring"></div>
              </div>
              <div className="profile-info">
                <span className="profile-name">{userName}</span>
                <span className="profile-status">Online</span>
              </div>
              <span className="profile-arrow">▼</span>
            </button>
            {/* Profile Menu */}
            {showProfileMenu && (
              <div className="profile-menu">
                <div className="menu-header">
                  <div className="menu-avatar">
                    <span className="avatar-text">{userName.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="menu-info">
                    <span className="menu-name">{userName}</span>
                    <span className="menu-email">{userEmail}</span>
                  </div>
                </div>
                <div className="menu-items">
                  <button className="menu-item logout" onClick={onLogout}>
                    <span className="menu-icon">🚪</span>
                    <span className="menu-text">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
