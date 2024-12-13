import React, { useEffect, useState } from 'react';
import { getIntegrations } from '../services/api';

export default function IntegrationsPage() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    getIntegrations().then(data => {
      if (Array.isArray(data)) setAccounts(data);
    });
  }, []);

  const handleConnectGmail = () => {
    window.location.href = 'http://localhost:5001/api/auth/google';
  };

  return (
    <div>
      <h1>Integrations</h1>
      <button className="btn" onClick={handleConnectGmail}>Connect Gmail</button>
      {accounts.length > 0 && (
        <ul style={{marginTop: '20px'}}>
          {accounts.map((acc, i) => (
            <li key={i}>{acc.email} (Gmail) connected at {acc.connectedAt}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
