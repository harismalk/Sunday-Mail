// frontend/src/pages/MemoriesPage.js
import React, { useEffect, useState } from 'react';
import './MemoriesPage.css';

export default function MemoriesPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, timeline

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [currentPage, filter, searchTerm]);

    async function fetchLogs() {
      try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        ...(searchTerm && { search: searchTerm }),
        ...(filter !== 'all' && { filter })
      });

      const res = await fetch(`http://localhost:5001/api/email-logs/logs?${params}`, {
          credentials: 'include',
        });
      
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}: ${res.statusText}`);
      }
      
        const data = await res.json();
      
      if (!data || !Array.isArray(data.logs)) {
        console.warn('API returned unexpected data format:', data);
        setLogs([]);
        setPagination({ page: 1, total: 0, pages: 0 });
      } else {
        setLogs(data.logs);
        setPagination(data.pagination || { page: 1, total: 0, pages: 0 });
      }
      } catch (err) {
      console.error('Error fetching logs:', err);
        setError(err.message);
      setLogs([]);
      setPagination({ page: 1, total: 0, pages: 0 });
      } finally {
        setLoading(false);
      }
    }

  async function fetchStats() {
    try {
      const res = await fetch('http://localhost:5001/api/email-logs/stats', {
        credentials: 'include',
      });
      
      if (!res.ok) {
        console.error('Failed to fetch stats:', res.status);
        return;
      }
      
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }

  const getActionIcon = (action) => {
    const actionIcons = {
      'marked important': '⭐',
      'auto drafted': '✏️',
      'auto replied': '↩️',
      'auto forwarded': '➡️',
      'texted user': '📱',
      'label': '🏷️'
    };
    
    for (const [key, icon] of Object.entries(actionIcons)) {
      if (action.toLowerCase().includes(key)) return icon;
    }
    return '⚡';
  };

  const getActionColor = (action) => {
    if (action.includes('important')) return 'linear-gradient(135deg, #ffd700, #ffed4e)';
    if (action.includes('draft')) return 'linear-gradient(135deg, #4CAF50, #45a049)';
    if (action.includes('reply')) return 'linear-gradient(135deg, #2196F3, #1976D2)';
    if (action.includes('forward')) return 'linear-gradient(135deg, #FF9800, #F57C00)';
    if (action.includes('text')) return 'linear-gradient(135deg, #9C27B0, #7B1FA2)';
    if (action.includes('label')) return 'linear-gradient(135deg, #607D8B, #455A64)';
    return 'linear-gradient(135deg, #757575, #616161)';
  };

  const getLabelColor = (label) => {
    const labelColors = {
      'Finance': 'linear-gradient(135deg, #4CAF50, #45a049)',
      'Investor': 'linear-gradient(135deg, #FF9800, #F57C00)',
      'Urgent': 'linear-gradient(135deg, #f44336, #d32f2f)',
      'Recruitment': 'linear-gradient(135deg, #2196F3, #1976D2)',
      'Billing': 'linear-gradient(135deg, #9C27B0, #7B1FA2)',
      'Support': 'linear-gradient(135deg, #607D8B, #455A64)'
    };
    return labelColors[label] || 'linear-gradient(135deg, #667eea, #764ba2)';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown time';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
      if (diffInHours < 48) return 'Yesterday';
      return date.toLocaleDateString();
    } catch (err) {
      return 'Invalid date';
    }
  };

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const safeLogs = Array.isArray(logs) ? logs : [];

  if (loading && !safeLogs.length) {
    return (
      <div className="memories-page">
        <div className="loading-container">
          <div className="loading-animation">
            <div className="loading-orb"></div>
            <div className="loading-orb"></div>
            <div className="loading-orb"></div>
          </div>
          <h3>Loading Your Automation Memories</h3>
          <p>Gathering your email processing history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="memories-page">
        <div className="error-container">
          <div className="error-animation">
            <div className="error-icon">⚠️</div>
          </div>
          <h2>Connection Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            <span>🔄</span>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="memories-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-title">
            <h1>📚 Automation Memories</h1>
            <div className="hero-subtitle">
              <span className="gradient-text">Track every automated action</span>
              <span className="hero-description">Your complete email processing history with intelligent insights</span>
            </div>
          </div>
          
          {stats && (
            <div className="stats-showcase">
              <div className="stat-highlight">
                <div className="stat-number">{stats.total || 0}</div>
                <div className="stat-label">Total Processed</div>
              </div>
              <div className="stat-highlight">
                <div className="stat-number">{stats.today || 0}</div>
                <div className="stat-label">Today</div>
              </div>
              <div className="stat-highlight">
                <div className="stat-number">{stats.thisWeek || 0}</div>
                <div className="stat-label">This Week</div>
              </div>
              <div className="stat-highlight">
                <div className="stat-number">{stats.uniqueLabels || 0}</div>
                <div className="stat-label">Labels Used</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls Section */}
      <div className="controls-section">
        <div className="search-container">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search emails, senders, or labels..."
              value={searchInput}
              onChange={handleSearch}
              className="search-input"
            />
            <div className="search-icon">🔍</div>
          </div>
        </div>

        <div className="controls-right">
          <div className="view-mode-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <span>⊞</span>
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <span>☰</span>
            </button>
            <button 
              className={`view-btn ${viewMode === 'timeline' ? 'active' : ''}`}
              onClick={() => setViewMode('timeline')}
            >
              <span>⏱️</span>
            </button>
          </div>

          <div className="filter-pills">
            <button 
              className={`filter-pill ${filter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              All Time
            </button>
            <button 
              className={`filter-pill ${filter === 'today' ? 'active' : ''}`}
              onClick={() => handleFilterChange('today')}
            >
              Today
            </button>
            <button 
              className={`filter-pill ${filter === 'week' ? 'active' : ''}`}
              onClick={() => handleFilterChange('week')}
            >
              This Week
            </button>
            <button 
              className={`filter-pill ${filter === 'month' ? 'active' : ''}`}
              onClick={() => handleFilterChange('month')}
            >
              This Month
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="content-section">
        {safeLogs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-animation">
              <div className="empty-icon">📭</div>
              <div className="empty-particles">
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
              </div>
            </div>
            <h3>No Memories Found</h3>
            <p>
              {searchTerm 
                ? `No emails match "${searchTerm}" in the selected time period.`
                : 'Start creating automations to see your processing history here!'
              }
            </p>
            <div className="empty-cta">
              
            </div>
          </div>
        ) : (
          <>
            <div className={`memories-container ${viewMode}`}>
              {safeLogs.map((log, index) => (
                <div 
                  key={log._id || index} 
                  className={`memory-item ${viewMode}`}
                  onClick={() => setSelectedLog(selectedLog === log._id ? null : log._id)}
                >
                  <div className="memory-content">
                    <div className="memory-header">
                      <div className="sender-section">
                        <div className="sender-avatar">
                          <div className="avatar-inner">
                            {(log.from || '?').charAt(0).toUpperCase()}
                          </div>
                          <div className="avatar-ring"></div>
                        </div>
                        <div className="sender-details">
                          <div className="sender-name">{log.from || 'Unknown Sender'}</div>
                          <div className="memory-time">{formatDate(log.processedAt)}</div>
                        </div>
                      </div>
                      <div className="memory-meta">
                        <div 
                          className="label-badge"
                          style={{ background: getLabelColor(log.labelApplied) }}
                        >
                          {log.labelApplied || 'No Label'}
                        </div>
                        <div className="memory-actions-count">
                          {log.actionsTaken && Array.isArray(log.actionsTaken) ? log.actionsTaken.length : 0} actions
                        </div>
                      </div>
                    </div>

                    <div className="memory-body">
                      <div className="memory-subject">
                        {log.subject || 'No Subject'}
                      </div>

                      {log.actionsTaken && Array.isArray(log.actionsTaken) && log.actionsTaken.length > 0 && (
                        <div className="actions-showcase">
                          <div className="actions-grid">
                            {log.actionsTaken.map((action, actionIndex) => (
                              <div 
                                key={actionIndex} 
                                className="action-item"
                                style={{ background: getActionColor(action) }}
                              >
                                <span className="action-icon">{getActionIcon(action)}</span>
                                <span className="action-text">{action}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="memory-footer">
                      <div className="memory-stats">
                        <span className="stat-item">
                          <span className="stat-icon">📧</span>
                          Processed
                        </span>
                        <span className="stat-item">
                          <span className="stat-icon">🏷️</span>
                          {log.labelApplied || 'No Label'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Pagination */}
            {pagination.pages > 1 && (
              <div className="pagination-section">
                <div className="pagination-container">
                  <button 
                    className="pagination-btn prev"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <span>←</span>
                    Previous
                  </button>
                  
                  <div className="pagination-info">
                    <span className="page-indicator">
                      Page {currentPage} of {pagination.pages}
                    </span>
                    <div className="page-progress">
                      <div 
                        className="progress-bar"
                        style={{ width: `${(currentPage / pagination.pages) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <button 
                    className="pagination-btn next"
                    disabled={currentPage === pagination.pages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}

            <div className="memories-summary">
              <div className="summary-content">
                <span className="summary-text">
                  Showing {safeLogs.length} of {pagination.total || 0} processed emails
                </span>
                <div className="summary-stats">
                  <span className="summary-stat">
                    <span className="stat-dot"></span>
                    {pagination.total || 0} total
                  </span>
                  <span className="summary-stat">
                    <span className="stat-dot"></span>
                    {stats?.uniqueLabels || 0} labels
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}