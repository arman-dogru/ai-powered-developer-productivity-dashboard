import React from 'react';

function Dashboard({ repo }) {
  return (
    <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
      <h3>Repository Details</h3>
      <p><strong>Name:</strong> {repo.name}</p>
      <p><strong>Description:</strong> {repo.description}</p>
      <p><strong>Owner:</strong> {repo.owner.login}</p>
      <p><strong>Stars:</strong> {repo.stargazers_count}</p>
      <p><strong>Forks:</strong> {repo.forks_count}</p>
      <p><strong>Open Issues:</strong> {repo.open_issues_count}</p>
      <p><strong>Watchers:</strong> {repo.watchers_count}</p>
      <p><strong>Language:</strong> {repo.language}</p>
      <p><strong>Default Branch:</strong> {repo.default_branch}</p>
      <p><strong>Created At:</strong> {new Date(repo.created_at).toLocaleDateString()}</p>
      <p><strong>Updated At:</strong> {new Date(repo.updated_at).toLocaleDateString()}</p>
      <p><strong>Pushed At:</strong> {new Date(repo.pushed_at).toLocaleDateString()}</p>
      <p><strong>License:</strong> {repo.license?.name || 'No license'}</p>
      <p><strong>Repository URL:</strong> <a href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.html_url}</a></p>
    </div>
  );
}

export default Dashboard;