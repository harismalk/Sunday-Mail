import React, { useEffect, useState } from 'react';
import { getIntegrations } from '../services/api';

const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://sunday-mail-api.onrender.com'
    : 'http://localhost:5001';

export default function IntegrationsPage() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    getIntegrations().then(data => {
      if (Array.isArray(data)) setAccounts(data);
    });
  }, []);

  const handleConnectGmail = () => {
    window.location.href = `${API_URL}/api/auth/google`;
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
