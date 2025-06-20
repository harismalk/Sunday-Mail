import React, { useState } from 'react';

export default function MemoriesDemo() {
  const [showDemo, setShowDemo] = useState(false);

  const sampleLogs = [
    {
      _id: '1',
      from: 'invoice@company.com',
      subject: 'Invoice #12345 - Payment Due',
      labelApplied: 'Finance',
      actionsTaken: ['marked important', 'auto drafted'],
      processedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      _id: '2',
      from: 'meeting@startup.com',
      subject: 'Follow-up: Investment Discussion',
      labelApplied: 'Investor',
      actionsTaken: ['auto replied', 'texted user'],
      processedAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
    },
    {
      _id: '3',
      from: 'urgent@client.com',
      subject: 'URGENT: Project Deadline Extension',
      labelApplied: 'Urgent',
      actionsTaken: ['marked important', 'auto forwarded'],
      processedAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
    },
    {
      _id: '4',
      from: 'recruitment@tech.com',
      subject: 'Application for Senior Developer Position',
      labelApplied: 'Recruitment',
      actionsTaken: ['auto drafted'],
      processedAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      _id: '5',
      from: 'support@service.com',
      subject: 'Your subscription has been renewed',
      labelApplied: 'Billing',
      actionsTaken: ['label "Billing" applied'],
      processedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    }
  ];

  const sampleStats = {
    total: 156,
    today: 3,
    thisWeek: 12,
    uniqueLabels: 8
  };

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
    if (action.includes('important')) return '#ffd700';
    if (action.includes('draft')) return '#4CAF50';
    if (action.includes('reply')) return '#2196F3';
    if (action.includes('forward')) return '#FF9800';
    if (action.includes('text')) return '#9C27B0';
    if (action.includes('label')) return '#607D8B';
    return '#757575';
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (!showDemo) {
    return (
      <div className="memories-demo-intro">
        <div className="demo-intro-content">
          <h2>📚 Automation Memories Demo</h2>
          <p>See how the memories tab tracks all your email automation history with a beautiful, modern interface.</p>
          <button 
            className="demo-btn"
            onClick={() => setShowDemo(true)}
          >
            View Demo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="memories-demo">
      <div className="demo-header">
        <h2>📚 Automation Memories</h2>
        <p>Track all the emails that have been automatically processed</p>
        <button 
          className="demo-close-btn"
          onClick={() => setShowDemo(false)}
        >
          × Close Demo
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{sampleStats.total}</div>
          <div className="stat-label">Total Processed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{sampleStats.today}</div>
          <div className="stat-label">Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{sampleStats.thisWeek}</div>
          <div className="stat-label">This Week</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{sampleStats.uniqueLabels}</div>
          <div className="stat-label">Labels Used</div>
        </div>
      </div>

      {/* Sample Memory Cards */}
      <div className="memories-grid">
        {sampleLogs.map((log) => (
          <div key={log._id} className="memory-card">
            <div className="memory-header">
              <div className="memory-sender">
                <div className="sender-avatar">
                  {log.from.charAt(0).toUpperCase()}
                </div>
                <div className="sender-info">
                  <div className="sender-name">{log.from}</div>
                  <div className="memory-time">{formatDate(log.processedAt)}</div>
                </div>
              </div>
              <div className="memory-label">
                <span className="label-badge">{log.labelApplied}</span>
              </div>
            </div>

            <div className="memory-subject">
              {log.subject}
            </div>

            {log.actionsTaken && log.actionsTaken.length > 0 && (
              <div className="memory-actions">
                <div className="actions-label">Actions Taken:</div>
                <div className="actions-list">
                  {log.actionsTaken.map((action, actionIndex) => (
                    <span 
                      key={actionIndex} 
                      className="action-tag"
                      style={{ backgroundColor: getActionColor(action) }}
                    >
                      {getActionIcon(action)} {action}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="demo-footer">
        <p>This is a demo showing sample automation history. In the real app, you'll see your actual processed emails!</p>
      </div>
    </div>
  );
} 