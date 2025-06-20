import React, { useState } from 'react';

export default function CreateLabelDialog({
  open,
  onClose,
  onLabelCreated,
  onBuildFromInstructions
}) {
  const [label, setLabel]                       = useState('');
  const [description, setDescription]           = useState('');
  const [useInstructions, setUseInstructions]   = useState(false);
  const [instructions, setInstructions]         = useState('');
  const [subjectContains, setSubjectContains]   = useState('');
  const [bodyContains, setBodyContains]         = useState('');
  const [isProcessing, setIsProcessing]         = useState(false);

  if (!open) return null;

  const handleSave = async () => {
    if (useInstructions) {
      // Rebuild via natural language
      setIsProcessing(true);
      try {
        await onBuildFromInstructions(instructions);
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Manual rule creation
      const payload = {
        label,
        description,
        conditions: {
          subjectContains: subjectContains
            .split(',')
            .map(s => s.trim())
            .filter(Boolean),
          bodyContains: bodyContains
            .split(',')
            .map(s => s.trim())
            .filter(Boolean),
        },
        actions: {},
      };
      await onLabelCreated(payload);
    }
    onClose();
  };

  const exampleInstructions = [
    "Label all invoices as 'Finance' and draft a professional thank you reply",
    "Mark urgent emails as important and forward them to manager@company.com",
    "Auto-reply to meeting requests with my availability and send me a text notification",
    "Draft a polite decline for all job applications and mark them as 'Recruitment'"
  ];

  return (
    <div className="dialog-backdrop">
      <div className="dialog dialog-large">
        <h2>Create New Automation</h2>

        <label>Label Name</label>
        <input
          type="text"
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="e.g., Finance, Urgent, Recruitment"
        />

        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Brief description of this automation"
        />

        <div className="field-group">
          <label>
            <input
              type="checkbox"
              checked={useInstructions}
              onChange={e => setUseInstructions(e.target.checked)}
            />{' '}
            Use Natural Language Instructions
            <span className="feature-badge">AI-Powered</span>
          </label>
          {useInstructions && (
            <p className="feature-description">
              Describe your automation in plain English. Actions will be automatically configured based on your instructions.
            </p>
          )}
        </div>

        {useInstructions ? (
          <div className="field-group">
            <label>Instructions</label>
            <textarea
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder="Describe what should happen when emails match this automation..."
              rows={4}
            />
            
            <div className="examples-section">
              <h4>Example Instructions:</h4>
              <ul className="examples-list">
                {exampleInstructions.map((example, index) => (
                  <li key={index} onClick={() => setInstructions(example)}>
                    {example}
                  </li>
                ))}
              </ul>
            </div>

            {instructions && (
              <div className="instruction-preview">
                <h4>What will be configured:</h4>
                <ul>
                  {instructions.toLowerCase().includes('important') && (
                    <li>✅ Mark emails as important</li>
                  )}
                  {instructions.toLowerCase().includes('draft') && (
                    <li>✅ Auto-draft replies with custom instructions</li>
                  )}
                  {instructions.toLowerCase().includes('reply') && (
                    <li>✅ Auto-reply with custom instructions</li>
                  )}
                  {instructions.toLowerCase().includes('forward') && (
                    <li>✅ Auto-forward emails</li>
                  )}
                  {instructions.toLowerCase().includes('text') && (
                    <li>✅ Send text notifications</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="field-group">
              <label>Subject Contains (comma-separated)</label>
              <input
                type="text"
                value={subjectContains}
                onChange={e => setSubjectContains(e.target.value)}
                placeholder="invoice, payment, urgent"
              />
            </div>
            <div className="field-group">
              <label>Body Contains (comma-separated)</label>
              <input
                type="text"
                value={bodyContains}
                onChange={e => setBodyContains(e.target.value)}
                placeholder="meeting, deadline, important"
              />
            </div>
          </>
        )}

        <div className="button-row">
          <button 
            className="btn" 
            onClick={handleSave}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Save'}
          </button>
          <button className="btn-close" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}