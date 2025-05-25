import React from 'react';

const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://sunday-mail-api.onrender.com'
    : 'http://localhost:5001';

export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };
  
  return (
    <div className="login-page">
      <h1>Welcome to Sunday</h1>
      <p>Connect your Gmail to get started.</p>
      <button className="btn" onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
}
