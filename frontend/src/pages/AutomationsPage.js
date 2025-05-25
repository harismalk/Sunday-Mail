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
  const [automations, setAutomations] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState(null);

  function loadAutomations() {
    getAutomations().then(data => {
      setAutomations(data);
    });
  }

  useEffect(() => {
    loadAutomations();
  }, []);

  const handleEdit = (auto) => {
    alert("Edit " + auto.label); 
  };

  const handleActions = (auto) => {
    setSelectedAutomation(auto);
    setDialogOpen(true);
  };

async function handleLabelCreated(payload) {
  await fetch('${API_URL}/api/automations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  loadAutomations();
}
  

  async function handleBuildFromInstructions(instructions) {
    const res = await fetch(`${API_URL}/api/automations/rebuild`, {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ instructions })
    });
    await res.json();
    loadAutomations();
  }

  async function onActionsSaved(automationId, actions) {
    // PATCH request to update automation actions
    const res = await fetch(`${API_URL}/api/automations/${automationId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actions })
    });
    const updated = await res.json();
    loadAutomations();
    setDialogOpen(false);
    setSelectedAutomation(null);
  }

  return (
    <div>
      <h1>Manage Automations</h1>
      <p>Create automations to organize your emails.</p>
      <button className="btn-primary" style={{marginRight:'10px'}} onClick={() => setCreateDialogOpen(true)}>Create New Label</button>
      <button className="btn" style={{marginRight:'10px'}}>Import from Email</button>

      {automations.length > 0 ? automations.map((auto, idx) => (
        <AutomationsCard
          key={idx}
          label={auto.label}
          description={auto.description}
          onEdit={() => handleEdit(auto)}
          onActions={() => handleActions(auto)}
        />
      )) : <p>No automations yet. Create one!</p> }

      <ActionsDialog open={dialogOpen} onClose={() => setDialogOpen(false)} automation={selectedAutomation} onActionsSaved={onActionsSaved} />
      <CreateLabelDialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        onLabelCreated={handleLabelCreated}
        onBuildFromInstructions={handleBuildFromInstructions}
      />
    </div>
  );
}
