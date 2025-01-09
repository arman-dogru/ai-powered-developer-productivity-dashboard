// frontend/src/Pages/AI/GeminiChat.js
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import ChatHistory from '../../Components/ChatHistory/ChatHistory';
import ChatInput from '../../Components/ChatInput/ChatInput';
import { fetchFileTree } from '../../Utils/aiUtils'; // Import the helper

// Import our new functions:
import { decide, action } from '../../Utils/aiUtils'; 
// fetchRepoRawData, fetchFileContent we define in this file.

function GeminiChat() {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [conversationContext, setConversationContext] = useState('');

  // We load the user's repo list for the dropdown
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState('');

  useEffect(() => {
    if (!user?.githubToken) return;
    const fetchRepositories = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_API_URL}/auth/repos`,
          {
            headers: { Authorization: `token ${user.githubToken}` },
            withCredentials: true,
          }
        );
        setRepos(res.data);
      } catch (error) {
        console.error('Error fetching repositories:', error);
      }
    };
    fetchRepositories();
  }, [user]);

  // Helper to fetch raw GitHub repo details JSON
  const fetchRepoRawData = async (repoFullName) => {
    const [owner, repo] = repoFullName.split('/');
    const config = { headers: { Authorization: `token ${user.githubToken}` } };
    const repoRes = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`,
      config
    );
    return repoRes.data;
  };

  // Helper to fetch file content
  const fetchFileContent = async (repoFullName, filePath) => {
    const [owner, repo] = repoFullName.split('/');
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
    const res = await axios.get(url, {
      headers: { Authorization: `token ${user.githubToken}` },
    });
    // decode from Base64
    return atob(res.data.content);
  };

  const sendMessage = async (text) => {
    // 1) Show user message in chat
    setMessages((prev) => [...prev, { sender: 'user', text }]);

    // 2) Update conversation context with the user message
    let updatedContext = conversationContext + `\nUser: ${text}`;

    // 3) Step 1: DECIDE
    const decisionString = await decide(updatedContext, text);
    console.log('decisionString:', decisionString);

    // 4) Step 2: ACTION => final answer
    const { finalAssistantText, updatedContext: newContext } = await action({
      decisionString,
      conversationContext: updatedContext,
      userMessage: text,
      fetchRepoRawData,
      fetchFileContent,
      fetchFileTree, // Pass the helper
      selectedRepo,
      user, // Pass user context for GitHub token
    });

    // 5) Add final assistant text to the messages
    setMessages((prev) => [...prev, { sender: 'assistant', text: finalAssistantText }]);

    // 6) Update the conversation context
    setConversationContext(newContext);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '10px' }}>
      <h2>Gemini AI Chat</h2>

      {/* The user picks a default repo from the dropdown, stored in selectedRepo */}
      <select
        value={selectedRepo}
        onChange={(e) => setSelectedRepo(e.target.value)}
        style={{ marginBottom: '10px' }}
      >
        <option value="">--Select a Repository--</option>
        {repos.map((repo) => (
          <option key={repo.id} value={repo.full_name}>
            {repo.full_name}
          </option>
        ))}
      </select>

      <ChatHistory messages={messages} />
      <ChatInput sendMessage={sendMessage} />
    </div>
  );
}

export default GeminiChat;
