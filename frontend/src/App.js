import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import HomePage from './pages/HomePage';
import IntegrationsPage from './pages/IntegrationsPage';
import AutomationsPage from './pages/AutomationsPage';
import MemoriesPage from './pages/MemoriesPage';
import SettingsPage from './pages/SettingsPage';
import InstructionsPage from './pages/InstructionsPage';
import LoginPage from './pages/LoginPage';
import ActionsPage from './pages/ActionsPage';
import { getUser } from './services/api';
import './App.css';
import './components/DarkTheme.css';

function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    getUser()
      .then(u => setUser(u))
      .catch(() => setUser(null));
  }, []);

  // While checking auth, show nothing or a loader
  if (user === undefined) {
    return <div>Loading…</div>;
  }

  // If not logged in, show login routes only
  if (!user) {
    return (
      <div className="login-container">
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </div>
    );
  }

  // When logged in, render the full app
  return (
    <div className="app-container">
      <Router>
        <Sidebar />
        <div className="main-content">
          <TopBar userName={user.name} />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/integrations" element={<IntegrationsPage />} />
              <Route path="/automations" element={<AutomationsPage />} />
              <Route path="/memories" element={<MemoriesPage />} />
              <Route
                path="/settings"
                element={<SettingsPage onLogout={() => setUser(null)} />}
              />
              <Route path="/instructions" element={<InstructionsPage />} />
              <Route path="/actions" element={<ActionsPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;