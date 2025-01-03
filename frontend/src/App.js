import React, { useEffect, useContext, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import Profile from './Pages/Profile/Profile';
import Repository from './Pages/Repository/Repository';
import { UserContext } from './UserContext';
import Login from './Pages/Login/Login';

function App() {
  const { user, setUser } = useContext(UserContext);
  const [repos, setRepos] = useState([]);

  // Fetch user data and repositories on mount
  useEffect(() => {
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

  // Fetch repositories for the logged-in user
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

  // If the user is not logged in, render the Login component
  if (!user) {
    return <Login />;
  }

  // Logout handler
  const handleLogout = () => {
    axios
      .get('http://localhost:4000/auth/logout', { withCredentials: true })
      .then(() => setUser(null))
      .catch((err) => console.error(err));
  };

  return (
    <Router>
      <div style={{ margin: '2px' }}>
        <h1>Welcome, {user.username}!</h1>
        <p>GitHub ID: {user.githubId}</p>
        <button onClick={handleLogout}>Logout</button>

        <h2>Your Repositories</h2>
        <ul>
          {repos.map((repo) => (
            <li key={repo.id}>
              {/* Fixed syntax using backticks for the template string */}
              <Link to={`/repo/${repo.owner.login}/${repo.name}`}>{repo.name}</Link>
            </li>
          ))}
        </ul>
      </div>

      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/repo/:username/:repoName" element={<Repository />} />
        <Route path="/" element={<div>Welcome to the GitHub OAuth App</div>} />
      </Routes>
    </Router>
  );
}

export default App;
