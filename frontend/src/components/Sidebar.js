import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">Sunday</div>
      <nav className="sidebar-nav">
        <NavLink to="/" className="nav-link">Home</NavLink>
        <NavLink to="/integrations" className="nav-link">Integrations</NavLink>
        <NavLink to="/automations" className="nav-link">Automations</NavLink>
        <NavLink to="/chat" className="nav-link">Chat</NavLink>
        <NavLink to="/memories" className="nav-link">Memories</NavLink>
        <NavLink to="/instructions" className="nav-link">Instructions</NavLink>
        <NavLink to="/settings" className="nav-link">Settings</NavLink>
        
      </nav>
    </div>
  );
}
