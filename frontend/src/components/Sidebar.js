import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Sidebar.css';

const sidebarVariants = {
  open: { width: 280, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' },
  collapsed: { width: 80, boxShadow: '0 4px 16px rgba(0,0,0,0.10)' },
};

const navStagger = {
  open: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
  collapsed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const navItemVariants = {
  open: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } },
  collapsed: { opacity: 0, x: -20, transition: { type: 'spring', stiffness: 400, damping: 30 } },
};

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/integrations', icon: '🔗', label: 'Integrations' },
    { path: '/automations', icon: '⚡', label: 'Automations' },
    { path: '/memories', icon: '📚', label: 'Memories' },
    { path: '/instructions', icon: '📝', label: 'Instructions' }
  ];

  const getActiveItem = () => {
    return navItems.find(item => item.path === location.pathname) || navItems[0];
  };

  function handleLogout() {
    // Clear tokens, session, etc.
    localStorage.removeItem('token');
    window.location.href = '/login'; // or your login route
  }

  return (
    <motion.div
      className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
      variants={sidebarVariants}
      animate={isCollapsed ? 'collapsed' : 'open'}
      initial={false}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
      transition={{ type: 'tween', duration: 0.22 }}
      style={{ overflow: 'hidden', background: 'var(--bg-card)', borderRight: '1px solid var(--border-primary)' }}
    >
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">
            <span className="logo-text">S</span>
            <div className="logo-glow"></div>
          </div>
          {!isCollapsed && (
            <div className="logo-text-container">
              <h1 className="logo-title">Sunday</h1>
              <span className="logo-subtitle">Automation Platform</span>
            </div>
          )}
        </div>
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="collapse-icon">
            {isCollapsed ? '→' : '←'}
          </span>
        </button>
      </div>
      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-header">
            {!isCollapsed && <span className="nav-title">Navigation</span>}
          </div>
          <motion.ul
            className="nav-items"
            variants={navStagger}
            animate={isCollapsed ? 'collapsed' : 'open'}
            initial={false}
          >
            {navItems.map((item) => (
              <motion.li key={item.path} variants={navItemVariants} style={{ listStyle: 'none' }}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                  <div className="nav-item-content">
                    <div className="nav-icon">
                      <span className="icon-emoji">{item.icon}</span>
                      <div className="icon-glow"></div>
                    </div>
                    {!isCollapsed && (
                      <div className="nav-text">
                        <span className="nav-label">{item.label}</span>
                      </div>
                    )}
                    <div className="nav-indicator">
                      <div className="indicator-dot"></div>
                    </div>
                  </div>
                  {/* Hover Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="nav-tooltip">
                      <span className="tooltip-text">{item.label}</span>
                    </div>
                  )}
                </NavLink>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </nav>
      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        {!isCollapsed && (
          <div className="footer-content">
            <div className="footer-stats">
              <div className="stat-item">
                <span className="stat-icon">📊</span>
                <div className="stat-info">
                  <span className="stat-value">24</span>
                  <span className="stat-label">Active</span>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">⚡</span>
                <div className="stat-info">
                  <span className="stat-value">156</span>
                  <span className="stat-label">Processed</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Active Item Indicator */}
      <div className="active-indicator" style={{
        top: `${navItems.findIndex(item => item.path === location.pathname) * 104 + 120 + 120}px`
      }}>
        <div className="indicator-line"></div>
        <div className="indicator-glow"></div>
      </div>
    </motion.div>
  );
}
