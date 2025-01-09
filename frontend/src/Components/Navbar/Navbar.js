// frontend/src/Component/Navbar/Navbar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import './Navbar.css';

function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:4000/auth/logout', {
        method: 'GET',
        credentials: 'include',
      });
      setUser(null); // Clear user context
      navigate('/'); // Redirect to the home or login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li>
          <Link to="/Repositories" className="nav-link">
            Repositories
          </Link>
        </li>
        <li>
          <Link to="/AI" className="nav-link">
            AI
          </Link>
        </li>
        <li>
          <Link to="/projects" className="nav-link">
            Projects
          </Link>
        </li>
      </ul>
      <div className="nav-profile">
        <div
          className="profile-avatar"
          style={{
            backgroundColor: 'purple',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
          }}
        ></div>
        <span className="profile-name">Can</span>
        <button
          onClick={handleLogout}
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'red',
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;





