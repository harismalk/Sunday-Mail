import React from "react";
import "./AutomationsCard.css";

export default function AutomationsCard({ label, description, onEdit, onActions }) {
  return (
    <div className="automation-card">
      <div className="card-content">
        <div>
          <h3 className="card-title">{label}</h3>
          <p className="card-description">{description}</p>
        </div>
        <div className="card-actions">
          <button className="btn" onClick={onActions}>Actions</button>
        </div>
      </div>
    </div>
  );
}
