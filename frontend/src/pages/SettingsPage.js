// frontend/src/pages/SettingsPage.js
import React from 'react';
import { logoutUser } from '../services/api';
import './SettingsPage.css';  // your existing styles

export default function SettingsPage({ onLogout }) {
  const handleLogout = async () => {
    try {
      await logoutUser();    // destroy session on server
    } catch (err) {
      console.error('Logout failed', err);
    }
    onLogout();              // clear user state in App → triggers login route
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      {/* any other settings controls */}
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
}