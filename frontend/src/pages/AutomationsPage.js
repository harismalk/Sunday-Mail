import React, { useEffect, useState } from 'react';
import AutomationsCard from '../components/AutomationsCard';
import ActionsDialog from '../components/ActionsDialog';
import CreateLabelDialog from '../components/CreateLabelDialog';
import { getAutomations, createAutomation } from '../services/api';

const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://sunday-mail.onrender.com'
    : 'http://localhost:5001';

export default function AutomationsPage() {
  const [automations, setAutomations]             = useState([]);
  const [dialogOpen, setDialogOpen]               = useState(false);
  const [createDialogOpen, setCreateDialogOpen]   = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState(null);

  const loadAutomations = () =>
    getAutomations().then(data => setAutomations(data));

  useEffect(() => {
    loadAutomations();
  }, []);

  const handleActions = auto => {
    setSelectedAutomation(auto);
    setDialogOpen(true);
  };

  async function handleLabelCreated(payload) {
    try {
      await createAutomation(payload);
      loadAutomations();
      setCreateDialogOpen(false);
    } catch (err) {
      console.error('Failed to create automation:', err);
      alert(err.message);
    }
  }

  async function handleBuildFromInstructions(instructions) {
    try {
      await fetch(`${API_URL}/api/automations/rebuild`, {
        method: 'POST',
        credentials: 'include',
        headers:  { 'Content-Type': 'application/json' },
        body:     JSON.stringify({ instructions: instructions.trim() }),
      });
      loadAutomations();
      setCreateDialogOpen(false);
    } catch (err) {
      console.error('Failed to build automations from instructions:', err);
      alert(err.message);
    }
  }

  async function onActionsSaved(automationId, actions) {
    try {
      await fetch(`${API_URL}/api/automations/${automationId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers:  { 'Content-Type': 'application/json' },
        body:     JSON.stringify({ actions }),
      });
      loadAutomations();
      setDialogOpen(false);
      setSelectedAutomation(null);
    } catch (err) {
      console.error('Failed to save actions:', err);
      alert(err.message);
    }
  }

  return (
    <div className="automations-page">
      <h1>Manage Automations</h1>
      <p>Create automations to organize your emails.</p>
      <button
        className="btn-primary"
        onClick={() => setCreateDialogOpen(true)}
      >
        Create New Automation
      </button>

      {automations.length > 0 ? (
        automations.map((auto, idx) => (
          <AutomationsCard
            key={idx}
            onActions={() => handleActions(auto)}
            label={auto.label}
            description={auto.description}
          />
        ))
      ) : (
        <p>No automations yet. Create one!</p>
      )}

      <ActionsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        automation={selectedAutomation}
        onActionsSaved={onActionsSaved}
      />

      <CreateLabelDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onLabelCreated={handleLabelCreated}
        onBuildFromInstructions={handleBuildFromInstructions}
      />
    </div>
  );
}