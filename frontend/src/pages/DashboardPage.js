import React, { useState, useEffect } from 'react';
import './DashboardPage.css';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalEmails: 0,
    processedToday: 0,
    labelsUsed: 0,
    automationRate: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [quickActions, setQuickActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats from API
      const statsResponse = await fetch('http://localhost:5001/api/email-logs/stats');
      const statsData = await statsResponse.json();
      
      if (statsResponse.ok) {
        setStats({
          totalEmails: statsData.total || 0,
          processedToday: statsData.today || 0,
          labelsUsed: statsData.uniqueLabels || 0,
          automationRate: statsData.total > 0 ? Math.round((statsData.total / (statsData.total + 10)) * 100) : 0
        });
      }

      // Fetch recent activity
      const activityResponse = await fetch('http://localhost:5001/api/email-logs/logs?limit=5');
      const activityData = await activityResponse.json();
      
      if (activityResponse.ok) {
        setRecentActivity(activityData.logs || []);
      }

      // Set up quick actions
      setQuickActions([
        {
          id: 1,
          title: 'Process Emails',
          description: 'Fetch and categorize new emails',
          icon: '📧',
          action: 'process',
          color: 'primary'
        },
        {
          id: 2,
          title: 'View Memories',
          description: 'See your automation history',
          icon: '🧠',
          action: 'memories',
          color: 'secondary'
        },
        {
          id: 3,
          title: 'Manage Labels',
          description: 'Configure email categories',
          icon: '🏷️',
          action: 'labels',
          color: 'accent'
        },
        {
          id: 4,
          title: 'Settings',
          description: 'Customize your preferences',
          icon: '⚙️',
          action: 'settings',
          color: 'neutral'
        }
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'process':
        // Navigate to process emails
        window.location.href = '/process';
        break;
      case 'memories':
        window.location.href = '/memories';
        break;
      case 'labels':
        window.location.href = '/labels';
        break;
      case 'settings':
        window.location.href = '/settings';
        break;
      default:
        break;
    }
  };

  const getActionIcon = (actions) => {
    if (!actions || actions.length === 0) return '📧';
    
    const action = actions[0];
    if (action.includes('label')) return '🏷️';
    if (action.includes('archive')) return '📁';
    if (action.includes('forward')) return '↗️';
    if (action.includes('reply')) return '↩️';
    return '✨';
  };

  const getActionColor = (actions) => {
    if (!actions || actions.length === 0) return 'neutral';
    
    const action = actions[0];
    if (action.includes('label')) return 'primary';
    if (action.includes('archive')) return 'secondary';
    if (action.includes('forward')) return 'accent';
    if (action.includes('reply')) return 'success';
    return 'neutral';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Welcome back! 👋</h1>
            <p>Here's what's happening with your email automation today</p>
          </div>
          <div className="header-illustration">
            <div className="floating-card card-1">📧</div>
            <div className="floating-card card-2">🏷️</div>
            <div className="floating-card card-3">✨</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.totalEmails.toLocaleString()}</h3>
            <p>Total Emails Processed</p>
          </div>
          <div className="stat-trend positive">+12% this week</div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <h3>{stats.processedToday}</h3>
            <p>Processed Today</p>
          </div>
          <div className="stat-trend positive">+5 today</div>
        </div>

        <div className="stat-card accent">
          <div className="stat-icon">🏷️</div>
          <div className="stat-content">
            <h3>{stats.labelsUsed}</h3>
            <p>Labels Used</p>
          </div>
          <div className="stat-trend neutral">Active</div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>{stats.automationRate}%</h3>
            <p>Automation Rate</p>
          </div>
          <div className="stat-trend positive">+8% this month</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content">
        {/* Quick Actions */}
        <div className="content-section">
          <div className="section-header">
            <h2>Quick Actions</h2>
            <p>Get things done faster</p>
          </div>
          <div className="quick-actions-grid">
            {quickActions.map((action) => (
              <div
                key={action.id}
                className={`quick-action-card ${action.color}`}
                onClick={() => handleQuickAction(action.action)}
              >
                <div className="action-icon">{action.icon}</div>
                <div className="action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
                <div className="action-arrow">→</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="content-section">
          <div className="section-header">
            <h2>Recent Activity</h2>
            <p>Your latest email automations</p>
          </div>
          <div className="activity-list">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={activity._id || index} className="activity-item">
                  <div className={`activity-icon ${getActionColor(activity.actionsTaken)}`}>
                    {getActionIcon(activity.actionsTaken)}
                  </div>
                  <div className="activity-content">
                    <div className="activity-header">
                      <h4>{activity.subject || 'Email processed'}</h4>
                      <span className="activity-time">{formatDate(activity.processedAt)}</span>
                    </div>
                    <p className="activity-sender">From: {activity.from || 'Unknown sender'}</p>
                    {activity.actionsTaken && activity.actionsTaken.length > 0 && (
                      <div className="activity-actions">
                        {activity.actionsTaken.map((action, actionIndex) => (
                          <span key={actionIndex} className="action-badge">
                            {action}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📧</div>
                <h3>No recent activity</h3>
                <p>Start processing emails to see your automation history here</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleQuickAction('process')}
                >
                  Process Emails
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Performance Insights */}
        <div className="content-section">
          <div className="section-header">
            <h2>Performance Insights</h2>
            <p>How your automation is performing</p>
          </div>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-header">
                <h4>Processing Speed</h4>
                <span className="insight-value">2.3s avg</span>
              </div>
              <div className="insight-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '85%' }}></div>
                </div>
                <span className="progress-label">85% efficiency</span>
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-header">
                <h4>Accuracy Rate</h4>
                <span className="insight-value">94%</span>
              </div>
              <div className="insight-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '94%' }}></div>
                </div>
                <span className="progress-label">Excellent</span>
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-header">
                <h4>Time Saved</h4>
                <span className="insight-value">12.5h</span>
              </div>
              <div className="insight-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '78%' }}></div>
                </div>
                <span className="progress-label">This month</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 