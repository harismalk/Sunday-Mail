import React from 'react';
import './Card.css';

const Card = ({ title, description }) => {
  return (
    <div className="card">
      <div className="card-content">
        <div className="icon-placeholder">
          <span className="dot"></span>
        </div>
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
      <div className="card-actions">
        <button className="edit-btn">
          <img src="/path-to-edit-icon.svg" alt="Edit Icon" />
          Edit
        </button>
        <button className="actions-btn">
          <img src="/path-to-actions-icon.svg" alt="Actions Icon" />
          Actions
        </button>
      </div>
    </div>
  );
};

export default Card;
