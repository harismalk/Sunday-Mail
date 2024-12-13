import React from 'react';
import './TopBar.css';

export default function TopBar({ userName }) {
  const hours = new Date().getHours();
  let greeting = 'Good afternoon';
  if (hours < 12) greeting = 'Good morning';
  else if (hours >= 17) greeting = 'Good evening';

  return (
    <div className="topbar">
      <div className="topbar-content">
        <h2>{greeting}, {userName}</h2>
      </div>
    </div>
  );
}
