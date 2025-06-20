import React, { useState, useEffect } from 'react';
import './LabelsPage.css';

const LabelsPage = () => {
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLabel, setEditingLabel] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [newLabel, setNewLabel] = useState({
    name: '',
    description: '',
    color: '#667eea',
    rules: []
  });

  const [editLabel, setEditLabel] = useState({
    name: '',
    description: '',
    color: '#667eea',
    rules: []
  });

  useEffect(() => {
    fetchLabels();
  }, []);

  const fetchLabels = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockLabels = [
        {
          id: 1,
          name: 'Important',
          description: 'High priority emails that require immediate attention',
          color: '#ef4444',
          rules: ['subject:urgent', 'from:boss@company.com'],
          emailCount: 45,
          lastUsed: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          name: 'Work',
          description: 'Professional emails from colleagues and clients',
          color: '#667eea',
          rules: ['from:*@company.com', 'subject:meeting'],
          emailCount: 128,
          lastUsed: '2024-01-15T09:15:00Z'
        },
        {
          id: 3,
          name: 'Personal',
          description: 'Personal emails from friends and family',
          color: '#10b981',
          rules: ['from:*@gmail.com', 'subject:family'],
          emailCount: 67,
          lastUsed: '2024-01-14T18:45:00Z'
        },
        {
          id: 4,
          name: 'Newsletters',
          description: 'Newsletters and promotional emails',
          color: '#f59e0b',
          rules: ['from:*@newsletter.com', 'subject:newsletter'],
          emailCount: 234,
          lastUsed: '2024-01-15T08:00:00Z'
        },
        {
          id: 5,
          name: 'Finance',
          description: 'Financial emails like invoices and receipts',
          color: '#8b5cf6',
          rules: ['subject:invoice', 'subject:receipt', 'from:*@bank.com'],
          emailCount: 89,
          lastUsed: '2024-01-15T11:20:00Z'
        }
      ];
      
      setLabels(mockLabels);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch labels');
      setLoading(false);
    }
  };

  const handleCreateLabel = async () => {
    if (!newLabel.name.trim()) {
      setError('Label name is required');
      return;
    }

    try {
      // Mock API call - replace with actual implementation
      const createdLabel = {
        id: Date.now(),
        ...newLabel,
        emailCount: 0,
        lastUsed: new Date().toISOString()
      };

      setLabels([...labels, createdLabel]);
      setShowCreateForm(false);
      setNewLabel({ name: '', description: '', color: '#667eea', rules: [] });
      setSuccess('Label created successfully');
    } catch (error) {
      setError('Failed to create label');
    }
  };

  const handleUpdateLabel = async () => {
    if (!editLabel.name.trim()) {
      setError('Label name is required');
      return;
    }

    try {
      // Mock API call - replace with actual implementation
      const updatedLabels = labels.map(label => 
        label.id === editingLabel.id ? { ...label, ...editLabel } : label
      );
      
      setLabels(updatedLabels);
      setEditingLabel(null);
      setEditLabel({ name: '', description: '', color: '#667eea', rules: [] });
      setSuccess('Label updated successfully');
    } catch (error) {
      setError('Failed to update label');
    }
  };

  const handleDeleteLabel = async (labelId) => {
    if (window.confirm('Are you sure you want to delete this label?')) {
      try {
        // Mock API call - replace with actual implementation
        const updatedLabels = labels.filter(label => label.id !== labelId);
        setLabels(updatedLabels);
        setSuccess('Label deleted successfully');
      } catch (error) {
        setError('Failed to delete label');
      }
    }
  };

  const startEditing = (label) => {
    setEditingLabel(label);
    setEditLabel({
      name: label.name,
      description: label.description,
      color: label.color,
      rules: [...label.rules]
    });
  };

  const addRule = (labelData, setLabelData) => {
    setLabelData({
      ...labelData,
      rules: [...labelData.rules, '']
    });
  };

  const updateRule = (labelData, setLabelData, index, value) => {
    const newRules = [...labelData.rules];
    newRules[index] = value;
    setLabelData({
      ...labelData,
      rules: newRules
    });
  };

  const removeRule = (labelData, setLabelData, index) => {
    const newRules = labelData.rules.filter((_, i) => i !== index);
    setLabelData({
      ...labelData,
      rules: newRules
    });
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

  if (loading) {
    return (
      <div className="labels-page">
        <div className="labels-loading">
          <div className="loading-spinner"></div>
          <p>Loading your labels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="labels-page">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Manage Labels 🏷️</h1>
            <p>Organize your emails with custom labels and automation rules</p>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateForm(true)}
            >
              ✨ Create New Label
            </button>
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
        {/* Labels Grid */}
        <div className="content-section">
          <div className="section-header">
            <h2>Your Labels ({labels.length})</h2>
            <p>Manage and customize your email organization system</p>
          </div>
          
          {labels.length > 0 ? (
            <div className="labels-grid">
              {labels.map((label) => (
                <div key={label.id} className="label-card">
                  <div className="label-header">
                    <div className="label-color" style={{ backgroundColor: label.color }}></div>
                    <div className="label-info">
                      <h3>{label.name}</h3>
                      <p>{label.description}</p>
                    </div>
                    <div className="label-actions">
                      <button 
                        className="action-btn edit"
                        onClick={() => startEditing(label)}
                        title="Edit label"
                      >
                        ✏️
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDeleteLabel(label.id)}
                        title="Delete label"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <div className="label-stats">
                    <div className="stat">
                      <span className="stat-value">{label.emailCount}</span>
                      <span className="stat-label">emails</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{label.rules.length}</span>
                      <span className="stat-label">rules</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{formatDate(label.lastUsed)}</span>
                      <span className="stat-label">last used</span>
                    </div>
                  </div>

                  {label.rules.length > 0 && (
                    <div className="label-rules">
                      <h4>Automation Rules:</h4>
                      <div className="rules-list">
                        {label.rules.map((rule, index) => (
                          <span key={index} className="rule-badge">
                            {rule}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🏷️</div>
              <h3>No labels yet</h3>
              <p>Create your first label to start organizing your emails automatically</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowCreateForm(true)}
              >
                Create First Label
              </button>
            </div>
          )}
        </div>

        {/* Create Label Form */}
        {showCreateForm && (
          <div className="content-section">
            <div className="section-header">
              <h2>Create New Label</h2>
              <p>Set up a new label with automation rules</p>
            </div>
            
            <div className="form-container">
              <div className="form-group">
                <label>Label Name *</label>
                <input
                  type="text"
                  value={newLabel.name}
                  onChange={(e) => setNewLabel({ ...newLabel, name: e.target.value })}
                  placeholder="e.g., Important, Work, Personal"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newLabel.description}
                  onChange={(e) => setNewLabel({ ...newLabel, description: e.target.value })}
                  placeholder="Describe what this label is for..."
                  className="form-textarea"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Color</label>
                <div className="color-picker">
                  {['#667eea', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'].map((color) => (
                    <button
                      key={color}
                      className={`color-option ${newLabel.color === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewLabel({ ...newLabel, color })}
                    />
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Automation Rules</label>
                <div className="rules-container">
                  {newLabel.rules.map((rule, index) => (
                    <div key={index} className="rule-input-group">
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => updateRule(newLabel, setNewLabel, index, e.target.value)}
                        placeholder="e.g., subject:urgent, from:*@company.com"
                        className="form-input"
                      />
                      <button
                        className="remove-rule-btn"
                        onClick={() => removeRule(newLabel, setNewLabel, index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    className="add-rule-btn"
                    onClick={() => addRule(newLabel, setNewLabel)}
                  >
                    + Add Rule
                  </button>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleCreateLabel}
                >
                  Create Label
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Label Form */}
        {editingLabel && (
          <div className="content-section">
            <div className="section-header">
              <h2>Edit Label: {editingLabel.name}</h2>
              <p>Update your label settings and rules</p>
            </div>
            
            <div className="form-container">
              <div className="form-group">
                <label>Label Name *</label>
                <input
                  type="text"
                  value={editLabel.name}
                  onChange={(e) => setEditLabel({ ...editLabel, name: e.target.value })}
                  placeholder="e.g., Important, Work, Personal"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editLabel.description}
                  onChange={(e) => setEditLabel({ ...editLabel, description: e.target.value })}
                  placeholder="Describe what this label is for..."
                  className="form-textarea"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Color</label>
                <div className="color-picker">
                  {['#667eea', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'].map((color) => (
                    <button
                      key={color}
                      className={`color-option ${editLabel.color === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setEditLabel({ ...editLabel, color })}
                    />
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Automation Rules</label>
                <div className="rules-container">
                  {editLabel.rules.map((rule, index) => (
                    <div key={index} className="rule-input-group">
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => updateRule(editLabel, setEditLabel, index, e.target.value)}
                        placeholder="e.g., subject:urgent, from:*@company.com"
                        className="form-input"
                      />
                      <button
                        className="remove-rule-btn"
                        onClick={() => removeRule(editLabel, setEditLabel, index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    className="add-rule-btn"
                    onClick={() => addRule(editLabel, setEditLabel)}
                  >
                    + Add Rule
                  </button>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setEditingLabel(null)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleUpdateLabel}
                >
                  Update Label
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="content-section">
          <div className="section-header">
            <h2>How Labels Work</h2>
            <p>Understanding email automation and labeling</p>
          </div>
          <div className="help-content">
            <div className="help-item">
              <div className="help-icon">🎯</div>
              <div className="help-text">
                <h4>Automatic Categorization</h4>
                <p>Labels automatically categorize emails based on rules you define, such as sender, subject, or content keywords.</p>
              </div>
            </div>
            <div className="help-item">
              <div className="help-icon">⚡</div>
              <div className="help-text">
                <h4>Real-time Processing</h4>
                <p>New emails are processed instantly and labeled according to your rules, keeping your inbox organized automatically.</p>
              </div>
            </div>
            <div className="help-item">
              <div className="help-icon">📊</div>
              <div className="help-text">
                <h4>Smart Analytics</h4>
                <p>Track how often each label is used and monitor the effectiveness of your automation rules over time.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabelsPage; 