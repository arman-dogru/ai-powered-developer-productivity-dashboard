import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserContext } from '../../UserContext';

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
    <div style={{ margin: '20px' }}>
      <h1>Repositories of {user.username}</h1>
      <ul>
        {repos.map((repo) => (
          <li key={repo.id}>
            <Link to={`/repositories/${repo.owner.login}/${repo.name}`}>
              {repo.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Repositories;
