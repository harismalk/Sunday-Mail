import React, { useState, useEffect } from 'react';
import { getInstructions, setInstructions } from '../services/api';

export default function InstructionsPage() {
  const [instructions, setLocalInstructions] = useState('');

  useEffect(() => {
    getInstructions().then(data => {
      if (data.instructions) {
        setLocalInstructions(data.instructions);
      }
    });
  }, []);

  async function handleSave() {
    await setInstructions(instructions);
    alert("Instructions saved! Go to Automations to rebuild them.");
  }

  return (
    <div>
      <h1>Define Your Instructions</h1>
      <textarea 
        value={instructions}
        onChange={(e) => setLocalInstructions(e.target.value)}
        style={{width: '100%', height: '200px'}}
      />
      <button className="btn" onClick={handleSave}>Save Instructions</button>
    </div>
  );
}
