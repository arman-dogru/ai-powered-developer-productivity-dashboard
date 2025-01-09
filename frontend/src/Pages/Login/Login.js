// frontend/src/Pages/Login/Login.js
import React from 'react';
import styles from './Login.module.css';
import GitHubLogo from '../../Assets/github-logo.png'; // Correct import path

function Login() {
    const handleLogin = () => {
        // Redirect the user to your backend's GitHub OAuth route
        window.location.href = 'http://localhost:4000/auth/github';
    };

    return (
        <div className={styles.loginContainer}>
            {/* Left Section: Heading and Button */}
            <div className={styles.leftSection}>
                <h1>Welcome to Velox AI!</h1>
                <button onClick={handleLogin}>
                    {/* Use the imported GitHubLogo */}
                    <img 
                        src={GitHubLogo} 
                        alt="GitHub Logo"
                        className={styles.githubLogo}
                    />
                    Login with GitHub
                </button>
            </div>

            {/* Middle Vertical Line */}
            <div className={styles.middleLine}></div>

            {/* Right Section: Image */}
            <div className={styles.rightSection}>
                <img 
                    src="https://i.pinimg.com/736x/1b/8a/f0/1b8af06023f0facf2ae14b43943acfed.jpg" 
                    alt="Example" 
                />
            </div>
        </div>
    );
}

export default Login;
