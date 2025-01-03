import React, { useEffect, useState, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

function CodeViewer() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { username, repoName } = useParams();
  
  const location = useLocation();
  const [filePath, setFilePath] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [language, setLanguage] = useState('plaintext');

  useEffect(() => {
    const splitted = location.pathname.split('/blob/');
    if (splitted.length > 1) {
      setFilePath(splitted[1]);
    }
  }, [location]);

  useEffect(() => {
    if (!user?.githubToken || !filePath) return;

    const fetchFile = async () => {
      try {
        const url = `https://api.github.com/repos/${username}/${repoName}/contents/${filePath}`;
        const config = {
          headers: {
            Authorization: `token ${user.githubToken}`,
          },
        };

        const res = await axios.get(url, config);
        const decodedContent = atob(res.data.content);
        setFileContent(decodedContent);

        const extension = filePath.split('.').pop().toLowerCase();
        setLanguage(getLanguageByExtension(extension));
      } catch (err) {
        console.error('Error fetching file:', err);
      }
    };

    fetchFile();
  }, [user, filePath, username, repoName]);

  const getLanguageByExtension = (ext) => {
    switch (ext) {
      case 'js': return 'javascript';
      case 'jsx': return 'jsx';
      case 'ts': return 'typescript';
      case 'tsx': return 'tsx';
      case 'py': return 'python';
      case 'java': return 'java';
      case 'css': return 'css';
      case 'html': return 'html';
      case 'json': return 'json';
      case 'md': return 'markdown';
      default: return 'plaintext';
    }
  };

  const handleBack = () => {
    navigate(`/repositories/${username}/${repoName}`);
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>Viewing File: {filePath}</h2>
      <button onClick={handleBack} style={{ marginBottom: '10px' }}>
        Back to {repoName}
      </button>
      <SyntaxHighlighter language={language} style={coy} showLineNumbers>
        {fileContent}
      </SyntaxHighlighter>
    </div>
  );
}

export default CodeViewer;
