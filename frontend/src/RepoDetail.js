import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import FileTree from './FileTree';
import { UserContext } from './UserContext'; // Import the context

function RepoDetail() {
  const { user } = useContext(UserContext); // Access user from context
  const { username, repoName } = useParams();
  const [repo, setRepo] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [contents, setContents] = useState([]);

  useEffect(() => {
    if (!user?.githubToken) return; // Wait until user is available

    const fetchRepoDetails = async () => {
      try {
        const config = {
          headers: {
            Authorization: `token ${user.githubToken}`,
          },
        };

        const repoRes = await axios.get(
          `https://api.github.com/repos/${username}/${repoName}`,
          config
        );
        setRepo(repoRes.data);

        const contributorsRes = await axios.get(
          `https://api.github.com/repos/${username}/${repoName}/contributors`,
          config
        );
        setContributors(contributorsRes.data);

        const contentsRes = await axios.get(
          `https://api.github.com/repos/${username}/${repoName}/contents`,
          config
        );
        setContents(contentsRes.data);
      } catch (err) {
        console.error('Error fetching repository:', err);
      }
    };

    fetchRepoDetails();
  }, [user, username, repoName]);

  if (!repo) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ margin: '20px' }}>
      <h1>{repo.name}</h1>
      <p>{repo.description}</p>
      <h2>Contributors</h2>
      <ul>
        {contributors.map((contributor) => (
          <li key={contributor.id}>
            <a href={contributor.html_url} target="_blank" rel="noopener noreferrer">
              {contributor.login}
            </a>
          </li>
        ))}
      </ul>
      <h2>File Structure</h2>
      <ul>
        {contents.map((item) => (
          <FileTree key={item.sha} item={item} />
        ))}
      </ul>
    </div>
  );
}

export default RepoDetail;
