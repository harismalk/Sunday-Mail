// frontend/src/pages/SettingsPage.js
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/api';

export default function SettingsPage({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();    // 1. hit the API to destroy session
    } catch (err) {
      console.error('Logout failed', err);
    }
    onLogout();           
    
  };

  return (
    <div>
      <h1>Settings</h1>
      {/* other settings… */}
      <button className="btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}