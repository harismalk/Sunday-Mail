import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import HomePage from './pages/HomePage';
import IntegrationsPage from './pages/IntegrationsPage';
import AutomationsPage from './pages/AutomationsPage';
import ChatPage from './pages/ChatPage';
import MemoriesPage from './pages/MemoriesPage';
import SettingsPage from './pages/SettingsPage';
import InstructionsPage from './pages/InstructionsPage';
import LoginPage from './pages/LoginPage';
import ActionsPage from './pages/ActionsPage'; // Import the new ActionsPage
import { getUser } from './services/api';
import './App.css';
import './components/DarkTheme.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser()
      .then(u => setUser(u))
      .catch(() => {});
  }, []);

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
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/memories" element={<MemoriesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/instructions" element={<InstructionsPage />} />
              <Route path="/actions" element={<ActionsPage />} /> {/* New route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
