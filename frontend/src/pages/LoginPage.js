import React from 'react';

export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5001/api/auth/google';
  };

  return (
    <div className="login-page">
      <h1>Welcome to Sunday</h1>
      <p>Connect your Gmail to get started.</p>
      <button className="btn" onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
}
