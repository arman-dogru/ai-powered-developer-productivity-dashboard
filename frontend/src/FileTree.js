// FileTree.js

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import { Link, useParams } from 'react-router-dom';

const FileTree = ({ item }) => {
  const { user } = useContext(UserContext);
  const [expanded, setExpanded] = useState(false);
  const [children, setChildren] = useState([]);
  // We need to know the current repo owner and name from params to construct the route
  const { username, repoName } = useParams();

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

  if (item.type === 'dir') {
    return (
      <li>
        <span onClick={toggleExpand} style={{ cursor: 'pointer' }}>
          {expanded ? '📂' : '📁'} {item.name}
        </span>
        {expanded && children.length > 0 && (
          <ul>
            {children.map((child) => (
              <FileTree key={child.sha} item={child} />
            ))}
          </ul>
        )}
      </li>
    );
  } else {
    // If it's a file, link to the CodeViewer page
    // We'll craft something like: /repo/:username/:repoName/blob/path/to/filename
    // 'path' is relative to root, which GitHub includes in item.path
    const fileViewerPath = `/repo/${username}/${repoName}/blob/${item.path}`;

    return (
      <li>
        <Link to={fileViewerPath} style={{ textDecoration: 'none', color: 'blue' }}>
          {item.name}
        </Link>
      </li>
    );
  }
};

export default FileTree;
