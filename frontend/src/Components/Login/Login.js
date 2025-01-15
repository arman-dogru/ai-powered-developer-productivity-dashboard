import React from 'react';
import './Login.css'; // Import the CSS file

function Login() {
  const handleLogin = () => {
    window.location.href = 'http://localhost:4000/auth/github';
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src="/logo.png" alt="Logo" className="login-logo" />
        <h1 className="login-title">Welcome to LLM DevOps Tool</h1>
        <button onClick={handleLogin} className="login-button">
          <img src="/github-logo.png" alt="GitHub Logo" className="github-logo" />
          Login with GitHub
        </button>
      </div>
    </div>
  );
}

export default Login;
