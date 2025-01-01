// src/App.js
import React, { useEffect, useContext, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import Profile from './Profile';
import RepoDetail from './RepoDetail';
import { UserContext } from './UserContext';

function App() {
  const { user, setUser } = useContext(UserContext);
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    // GET /auth/user with credentials
    axios
      .get('http://localhost:4000/auth/user', { withCredentials: true })
      .then((res) => {
        setUser(res.data);
        fetchRepositories();
      })
      .catch((err) => {
        console.log('No logged-in user or error:', err.response?.data);
      });
  }, [setUser]);

  const fetchRepositories = () => {
    axios
      .get('http://localhost:4000/auth/repos', { withCredentials: true })
      .then((res) => {
        setRepos(res.data);
      })
      .catch((err) => {
        console.error('Error fetching repositories:', err.response?.data);
      });
  };

  if (!user) {
    return (
      <div style={{ margin: '20px' }}>
        <h1>GitHub OAuth Example</h1>
        <button onClick={() => (window.location.href = 'http://localhost:4000/auth/github')}>
          Login with GitHub
        </button>
      </div>
    );
  }

  const handleLogout = () => {
    axios
      .get('http://localhost:4000/auth/logout', { withCredentials: true })
      .then(() => setUser(null))
      .catch((err) => console.error(err));
  };

  return (
    <Router>
      <div style={{ margin: '20px' }}>
        <h1>Welcome, {user.username}!</h1>
        <p>GitHub ID: {user.githubId}</p>
        <button onClick={handleLogout}>Logout</button>

        <h2>Your Repositories</h2>
        <ul>
          {repos.map((repo) => (
            <li key={repo.id}>
              <Link to={`/repo/${user.username}/${repo.name}`}>{repo.name}</Link>
            </li>
          ))}
        </ul>
      </div>

      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/repo/:username/:repoName" element={<RepoDetail />} />
        <Route path="/" element={<div>Welcome to the GitHub OAuth App</div>} />
      </Routes>
    </Router>
  );
}

export default App;
