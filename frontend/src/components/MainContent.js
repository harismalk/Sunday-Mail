import React from 'react';
import './MainContent.css';

function MainContent() {
  return (
    <div className="main-content">
      <h1>Manage Automations</h1>
      <p>Create automations to organize your emails. Select how far back to classify emails when creating a new label.</p>
      <div className="actions">
        <button className="btn">+ Create New Label</button>
        <button className="btn">Import from Email</button>
      </div>
      <div className="automation-list">
        <div className="automation-item">
          <span className="label">Investor Email</span>
          <p>Emails from investors who want to book a meeting to invest in Sunday</p>
          <div className="actions">
            <button>Edit</button>
            <button>Actions</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainContent;
