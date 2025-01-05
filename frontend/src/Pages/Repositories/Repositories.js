import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import './Repositories.css'; // Import the CSS file

function Repositories() {
  const { user } = useContext(UserContext);
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    if (!user) return; // Wait until user is loaded

    const fetchRepositories = async () => {
      try {
        const res = await axios.get('http://localhost:4000/auth/repos', {
          withCredentials: true,
        });
        setRepos(res.data);
      } catch (error) {
        console.error('Error fetching repositories:', error);
      }
    };

    fetchRepositories();
  }, [user]);

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="repositories-container">
      <h1 className="repositories-title">Repositories of {user.username}</h1>
      <ul className="repositories-list">
        {repos.map((repo) => (
          <li key={repo.id}>
            <Link
              to={`/repositories/${repo.owner.login}/${repo.name}`}
              className="repositories-link"
            >
              {repo.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Repositories;
