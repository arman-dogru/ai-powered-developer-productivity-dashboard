import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';

function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:4000/auth/logout', {
        method: 'GET',
        credentials: 'include',
      });
      setUser(null);       // Clear user context
      navigate('/');       // Optionally redirect to home or login
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav style={styles.navbar}>
      <ul style={styles.navList}>
        <li>
          <Link to="/profile" style={styles.link}>
            Profile
          </Link>
        </li>
        <li>
          <Link to="/repositories" style={styles.link}>
            Repositories
          </Link>
        </li>
        <li>
          <Link to="/ai" style={styles.link}>
            AI
          </Link>
        </li>
        <li>
          <button onClick={handleLogout} style={styles.button}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: '#f0f0f0',
    padding: '10px',
  },
  navList: {
    listStyleType: 'none',
    display: 'flex',
    gap: '15px',
    margin: 0,
    padding: 0,
  },
  link: {
    textDecoration: 'none',
    color: 'black',
    fontWeight: 'bold',
  },
  button: {
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default Navbar;
