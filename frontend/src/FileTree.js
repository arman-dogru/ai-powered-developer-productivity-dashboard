import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext'; // Import the context

const FileTree = ({ item }) => {
  const { user } = useContext(UserContext); // Access user from context
  const [expanded, setExpanded] = useState(false);
  const [children, setChildren] = useState([]);

  const toggleExpand = async () => {
    if (!expanded && item.type === 'dir') {
      try {
        const res = await axios.get(item.url, {
          headers: {
            Authorization: `token ${user.githubToken}`,
          },
        });
        setChildren(res.data);
      } catch (err) {
        console.error('Error fetching directory contents:', err);
      }
    }
    setExpanded(!expanded);
  };

  return (
    <li>
      {item.type === 'dir' ? (
        <span onClick={toggleExpand} style={{ cursor: 'pointer' }}>
          {expanded ? '📂' : '📁'} {item.name}
        </span>
      ) : (
        <a href={item.html_url} target="_blank" rel="noopener noreferrer">
          {item.name}
        </a>
      )}
      {expanded && children.length > 0 && (
        <ul>
          {children.map((child) => (
            <FileTree key={child.sha} item={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default FileTree;
