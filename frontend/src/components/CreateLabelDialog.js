import React, { useState } from 'react';

export default function CreateLabelDialog({ open, onClose, onLabelCreated, onBuildFromInstructions }) {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [subjectContains, setSubjectContains] = useState('');
  const [bodyContains, setBodyContains] = useState('');
  const [useInstructions, setUseInstructions] = useState(false);
  const [instructions, setInstructions] = useState('');

  if (!open) return null;

  async function handleSave() {
    if (useInstructions) {
      // Save label with natural language instructions
      const payload = { label, description, instructions };
      await onLabelCreated(payload);
    } else {
      const conditions = {
        subjectContains: subjectContains.split(',').map((s) => s.trim()).filter(Boolean),
        bodyContains: bodyContains.split(',').map((s) => s.trim()).filter(Boolean),
      };
      const actions = {}; // Initially empty
      await onLabelCreated({ label, description, conditions, actions });
    }
    onClose();
  }

  return (
    <div className="dialog-backdrop">
      <div className="dialog">
        <h2>Create New Label</h2>
        <label>Label Name</label>
        <input value={label} onChange={(e) => setLabel(e.target.value)} />
        <label>Description</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} />

        <div style={{ margin: '10px 0' }}>
          <input
            type="checkbox"
            checked={useInstructions}
            onChange={(e) => setUseInstructions(e.target.checked)}
          />
          <span>Use Natural Language Instructions</span>
        </div>

        {useInstructions ? (
          <>
            <label>Instructions</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              style={{ width: '100%', height: '100px' }}
            />
          </>
        ) : (
          <>
            <label>Subject Contains (comma separated)</label>
            <input value={subjectContains} onChange={(e) => setSubjectContains(e.target.value)} />
            <label>Body Contains (comma separated)</label>
            <input value={bodyContains} onChange={(e) => setBodyContains(e.target.value)} />
          </>
        )}

        <button className="btn" onClick={handleSave}>
          Save
        </button>
        <button className="btn-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
