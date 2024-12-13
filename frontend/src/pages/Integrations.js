import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function Integrations() {
  const [connectedAccounts, setConnectedAccounts] = useState([]);

  const handleConnect = (provider) => {
    setConnectedAccounts([...connectedAccounts, `${provider}@example.com`]);
  };

  return (
    <div className="page">
      <Sidebar />
      <div className="page-content">
        <Header title="Integrations" />
        <div className="integration-options">
          <button onClick={() => handleConnect("google")} className="btn">
            Connect Google Account
          </button>
          <button onClick={() => handleConnect("microsoft")} className="btn">
            Connect Microsoft Account
          </button>
        </div>
        <ul>
          {connectedAccounts.map((account) => (
            <li key={account}>{account}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
