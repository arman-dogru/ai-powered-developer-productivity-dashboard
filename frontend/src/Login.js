import React from 'react';
import './Login.css';
import GitHubLogo from './Assets/github-logo.png'; // Correct import path

function Login() {
    const handleLogin = () => {
        // Redirect the user to your backend's GitHub OAuth route
        window.location.href = 'http://localhost:4000/auth/github';
    };

    return (
        <div className="login-container">
            {/* Left Section: Heading and Button */}
            <div className="left-section">
                <h1>Welcome to Velox AI!</h1>
                <button onClick={handleLogin}>
                    {/* Use the imported GitHubLogo */}
                    <img 
                        src={GitHubLogo} 
                        alt="GitHub Logo"
                        className="github-logo"
                    />
                    Login with GitHub
                </button>
            </div>

            {/* Middle Vertical Line */}
            <div className="middle-line"></div>

            {/* Right Section: Image */}
            <div className="right-section">
                <img 
                    src="https://i.pinimg.com/736x/1b/8a/f0/1b8af06023f0facf2ae14b43943acfed.jpg" 
                    alt="Example" 
                />
            </div>
        </div>
    );
}

export default Login;