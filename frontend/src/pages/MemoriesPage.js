// frontend/src/pages/MemoriesPage.js
import React, { useEffect, useState } from 'react';
import './MemoriesPage.css';

export default function MemoriesPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch('http://localhost:5001/api/email-logs/logs', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  if (loading) return <p>Loading history…</p>;
  if (error)   return <p className="error">Error: {error}</p>;
  if (logs.length === 0) return <p>No past automations found.</p>;

  return (
    <div className="memories-page">
      <h1>Automation History</h1>
      <table className="memories-table">
        <thead>
          <tr>
            <th>Processed At</th>
            <th>Sender</th>
            <th>Subject</th>
            <th>Label Applied</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log._id}>
              <td>{new Date(log.processedAt).toLocaleString()}</td>
              <td>{log.from}</td>
              <td>{log.subject}</td>
              <td>{log.labelApplied}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}