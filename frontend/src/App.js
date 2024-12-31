import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);

  // Fetch the current user, if any
  useEffect(() => {
    axios
.get(process.env.REACT_APP_GITHUB_USER_URL, { withCredentials: true })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log('No logged in user or error:', err.response?.data);
      });
  }, []);

  const handleLogin = () => {
    window.location.href = process.env.REACT_APP_GITHUB_LOGIN_URL;
  };

  const handleLogout = () => {
    axios
      .get(process.env.REACT_APP_GITHUB_LOGOUT_URL, { withCredentials: true })
      .then(() => {
        setUser(null);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  if (!user) {
    // No user logged in, show login button
    return (
      <div style={{ margin: '20px' }}>
        <h1>GitHub OAuth Example</h1>
        <button onClick={handleLogin}>Login with GitHub</button>
      </div>
    );
  }

  // If user is logged in, display user data
  return (
    <div style={{ margin: '20px' }}>
      <h1>Welcome, {user.username}!</h1>
      <p>User ID: {user._id}</p>
      <p>GitHub ID: {user.githubId}</p>
      <p>Display Name: {user.displayName}</p>
      <p>GitHub Profile: {user.profileUrl}</p>
      <div>
        {user.photos && user.photos.map((url, index) => (
          <img key={index} src={url} alt="avatar" style={{ width: '50px' }} />
        ))}
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default App;
