import React from 'react';
import './SettingsPage.css';

export default function SettingsPage({ onLogout }) {
  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <button onClick={onLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
}
