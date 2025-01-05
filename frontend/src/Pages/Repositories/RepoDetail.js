import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import FileTree from '../../Components/FileTree/FileTree';
import Dashboard from '../../Components/Dashboard/Dashboard';
import './RepoDetail.css'; // Import the CSS file

function RepoDetail() {
  const { user } = useContext(UserContext);
  const { username, repoName } = useParams();
  const [repo, setRepo] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [contents, setContents] = useState([]);

  useEffect(() => {
    if (!user?.githubToken) return;

    const fetchRepoDetails = async () => {
      try {
        const config = {
          headers: {
            Authorization: `token ${user.githubToken}`,
          },
        };

        // Fetch basic repo info
        const repoRes = await axios.get(
          `https://api.github.com/repos/${username}/${repoName}`,
          config
        );
        setRepo(repoRes.data);

        // Fetch contributors
        const contributorsRes = await axios.get(
          `https://api.github.com/repos/${username}/${repoName}/contributors`,
          config
        );
        setContributors(contributorsRes.data);

        // Fetch top-level contents
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
    <div className="repo-detail-container">
      <h1 className="repo-detail-title">{repo.name}</h1>
      <p className="repo-detail-description">{repo.description}</p>

      {/* Pass repo details to Dashboard component */}
      <Dashboard repo={repo} />

      <div className="repo-section">
        <h2 className="repo-section-title">Contributors</h2>
        <ul className="repo-list">
          {contributors.map((c) => (
            <li key={c.id}>
              <a
                href={c.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="repo-link"
              >
                {c.login}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="repo-section">
        <h2 className="repo-section-title">File Structure</h2>
        <ul className="repo-list">
          {contents.map((item) => (
            <FileTree key={item.sha} item={item} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default RepoDetail;