const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://sunday-mail.onrender.com'
    : 'http://localhost:5001';

export async function getUser() {
  const res = await fetch(`${API_URL}/api/auth/user`, { credentials: 'include' });
  if (res.ok) return res.json();
  throw new Error('Not authenticated');
}

export async function getIntegrations() {
  const res = await fetch(`${API_URL}/api/integrations`, { credentials: 'include' });
  return res.json();
}

export async function getAutomations() {
  const res = await fetch(`${API_URL}/api/automations`, { credentials: 'include' });
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function createAutomation(payload) {
  const res = await fetch(`${API_URL}/api/automations`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function rebuildAutomations(instructions) {
  const res = await fetch(`${API_URL}/api/automations/rebuild`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ instructions }),
  });
  return res.json();
}

export async function updateAutomation(automationId, actions) {
  const res = await fetch(`${API_URL}/api/automations/${automationId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actions }),
  });
  return res.json();
}

export async function getInstructions() {
  const res = await fetch(`${API_URL}/api/user-config/instructions`, { credentials: 'include' });
  return res.json();
}

export async function setInstructions(instructions) {
  const res = await fetch(`${API_URL}/api/user-config/instructions`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ instructions }),
  });
  return res.json();
}

export async function sendChatMessage(message) {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  return res.json();
}


