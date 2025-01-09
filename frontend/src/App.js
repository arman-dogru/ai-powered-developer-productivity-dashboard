// frontend/src/App.js
import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import { UserContext } from './UserContext';
import Login from './Pages/Login/Login';
import Navbar from './Components/Navbar/Navbar';

import Profile from './Pages/Profile/Profile';
import AI from './Pages/AI/AI';
import Repositories from './Pages/Repositories/Repositories';
import RepoDetail from './Pages/Repositories/RepoDetail';
import CodeViewer from './Pages/CodeViewer/CodeViewer';

import GeminiChat from './Pages/AI/GeminiChat'; // import your new Gemini page

function App() {
  const { user, setUser } = useContext(UserContext);

  // Fetch user on mount
  useEffect(() => {
    axios
      .get('http://localhost:4000/auth/user', { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => {
        // Not logged in or error
      });
  }, [setUser]);

  // If not logged in, show Login
  if (!user) {
    return <Login />;
  }

  // If logged in, show Navbar + routes
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Repositories />} />
        <Route path="/ai" element={<GeminiChat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/repositories" element={<Repositories />} />

        {/* Single repository detail */}
        <Route path="/repositories/:username/:repoName" element={<RepoDetail />} />

        {/* Code viewer */}
        <Route path="/repositories/:username/:repoName/blob/*" element={<CodeViewer />} />

        {/* Fallback if needed */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;