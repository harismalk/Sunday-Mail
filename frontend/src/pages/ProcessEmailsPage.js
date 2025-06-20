import React, { useState, useEffect } from 'react';
import './ProcessEmailsPage.css';

const ProcessEmailsPage = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    categorized: 0,
    labeled: 0,
    archived: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/email-logs/stats');
      const data = await response.json();
      
      if (response.ok) {
        setStats({
          total: data.total || 0,
          categorized: data.total || 0,
          labeled: data.labeled || 0,
          archived: data.archived || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchEmails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5001/api/email-logs/test-fetch-emails');
      const data = await response.json();
      
      if (response.ok) {
        setEmails(data.emails || []);
        setSuccess(`Successfully fetched ${data.emails?.length || 0} emails`);
      } else {
        setError(data.message || 'Failed to fetch emails');
      }
    } catch (error) {
      setError('Network error occurred while fetching emails');
    } finally {
      setLoading(false);
    }
  };

  const processEmails = async () => {
    setProcessing(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch('http://localhost:5001/api/email-logs/process-emails');
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(`Successfully processed ${data.processed || 0} emails`);
        fetchStats(); // Refresh stats
        setEmails([]); // Clear fetched emails
      } else {
        setError(data.message || 'Failed to process emails');
      }
    } catch (error) {
      setError('Network error occurred while processing emails');
    } finally {
      setProcessing(false);
    }
  };

  const getEmailIcon = (email) => {
    // Determine icon based on email content or sender
    const subject = email.subject?.toLowerCase() || '';
    const from = email.from?.toLowerCase() || '';
    
    if (subject.includes('urgent') || subject.includes('important')) return '🚨';
    if (subject.includes('meeting') || subject.includes('call')) return '📅';
    if (subject.includes('invoice') || subject.includes('payment')) return '💰';
    if (subject.includes('newsletter') || subject.includes('update')) return '📰';
    if (from.includes('noreply') || from.includes('donotreply')) return '📢';
    return '📧';
  };

  const getEmailCategory = (email) => {
    const subject = email.subject?.toLowerCase() || '';
    const from = email.from?.toLowerCase() || '';
    
    if (subject.includes('urgent') || subject.includes('important')) return 'urgent';
    if (subject.includes('meeting') || subject.includes('call')) return 'meeting';
    if (subject.includes('invoice') || subject.includes('payment')) return 'financial';
    if (subject.includes('newsletter') || subject.includes('update')) return 'newsletter';
    if (from.includes('noreply') || from.includes('donotreply')) return 'notification';
    return 'general';
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'urgent': return 'error';
      case 'meeting': return 'primary';
      case 'financial': return 'success';
      case 'newsletter': return 'secondary';
      case 'notification': return 'accent';
      default: return 'neutral';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="process-emails-page">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Process Emails 🚀</h1>
            <p>Fetch and automatically categorize your emails with AI-powered automation</p>
          </div>
          <div className="header-actions">
            <button 
              className={`btn btn-primary ${loading ? 'loading' : ''}`}
              onClick={fetchEmails}
              disabled={loading || processing}
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Fetching...
                </>
              ) : (
                <>
                  📥 Fetch Emails
                </>
              )}
            </button>
            <button 
              className={`btn btn-success ${processing ? 'loading' : ''}`}
              onClick={processEmails}
              disabled={loading || processing}
            >
              {processing ? (
                <>
                  <div className="btn-spinner"></div>
                  Processing...
                </>
              ) : (
                <>
                  ⚡ Process & Categorize
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-item">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.total.toLocaleString()}</h3>
            <p>Total Processed</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">🏷️</div>
          <div className="stat-content">
            <h3>{stats.categorized.toLocaleString()}</h3>
            <p>Categorized</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">📁</div>
          <div className="stat-content">
            <h3>{stats.archived.toLocaleString()}</h3>
            <p>Archived</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>{stats.total > 0 ? Math.round((stats.categorized / stats.total) * 100) : 0}%</h3>
            <p>Success Rate</p>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="status-message error">
          <div className="status-icon">⚠️</div>
          <div className="status-content">
            <h4>Error</h4>
            <p>{error}</p>
          </div>
          <button 
            className="status-close"
            onClick={() => setError(null)}
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="status-message success">
          <div className="status-icon">✅</div>
          <div className="status-content">
            <h4>Success</h4>
            <p>{success}</p>
          </div>
          <button 
            className="status-close"
            onClick={() => setSuccess(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="main-content">
        {/* Fetched Emails */}
        {emails.length > 0 && (
          <div className="content-section">
            <div className="section-header">
              <h2>Fetched Emails ({emails.length})</h2>
              <p>Review emails before processing</p>
            </div>
            <div className="emails-grid">
              {emails.map((email, index) => {
                const category = getEmailCategory(email);
                const color = getCategoryColor(category);
                
                return (
                  <div key={email.id || index} className={`email-card ${color}`}>
                    <div className="email-header">
                      <div className="email-icon">{getEmailIcon(email)}</div>
                      <div className="email-meta">
                        <h4>{email.subject || 'No Subject'}</h4>
                        <p className="email-from">{email.from || 'Unknown Sender'}</p>
                        <span className="email-date">{formatDate(email.date || new Date())}</span>
                      </div>
                      <div className={`category-badge ${color}`}>
                        {category}
                      </div>
                    </div>
                    <div className="email-content">
                      <p>{truncateText(email.snippet || email.body || 'No content available')}</p>
                    </div>
                    <div className="email-actions">
                      <span className="action-preview">Will be categorized as: {category}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Processing Guide */}
        <div className="content-section">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Understanding the email processing workflow</p>
          </div>
          <div className="workflow-steps">
            <div className="workflow-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Fetch Emails</h4>
                <p>Retrieve new emails from your Gmail account using the Gmail API</p>
              </div>
            </div>
            <div className="workflow-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>AI Analysis</h4>
                <p>Our AI analyzes email content, sender, and context to determine the best category</p>
              </div>
            </div>
            <div className="workflow-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Apply Labels</h4>
                <p>Automatically apply Gmail labels and organize emails into appropriate folders</p>
              </div>
            </div>
            <div className="workflow-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Take Actions</h4>
                <p>Perform additional actions like archiving, forwarding, or marking as important</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="content-section">
          <div className="section-header">
            <h2>Automation Features</h2>
            <p>What our AI can do for your emails</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h4>Smart Categorization</h4>
              <p>AI-powered email classification based on content, sender, and context</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏷️</div>
              <h4>Auto Labeling</h4>
              <p>Automatically apply Gmail labels to organize your inbox efficiently</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📁</div>
              <h4>Smart Archiving</h4>
              <p>Archive low-priority emails to keep your inbox clean and focused</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h4>Instant Processing</h4>
              <p>Process hundreds of emails in seconds with our optimized algorithms</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h4>Detailed Analytics</h4>
              <p>Track processing statistics and automation performance over time</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h4>Secure & Private</h4>
              <p>Your emails are processed securely with end-to-end encryption</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessEmailsPage; 