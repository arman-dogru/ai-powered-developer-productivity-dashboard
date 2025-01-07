// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const axios = require('axios');
const cors = require('cors');

// Our DB connector and model
const connectDB = require('./db');
const User = require('./models/User');

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ---------------
// Gemini Utilities
// ---------------
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Helper function to get the Gemini model
function getGeminiModel() {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
}

// Use the same "decide/action" or a simpler version to generate text:
async function generateGeminiPRComment(promptText) {
  try {
    const model = getGeminiModel();
    const result = await model.generateContent(promptText);
    return result.response.text();
  } catch (err) {
    console.error('Gemini Error:', err);
    return 'Error generating AI response.';
  }
}

// ---------------
// Webhook Handling
// ---------------

// Verify the GitHub webhook signature (optional but recommended)
function verifyGithubSignature(req, res, buf) {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) {
    throw new Error('No X-Hub-Signature-256 header');
  }

  const hmac = crypto.createHmac('sha256', process.env.GH_WEBHOOK_SECRET);
  hmac.update(buf);
  const digest = 'sha256=' + hmac.digest('hex');

  if (signature !== digest) {
    throw new Error('Signature mismatch');
  }
}

// If you want to verify signatures:
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      if (req.headers['x-hub-signature-256']) {
        verifyGithubSignature(req, res, buf);
      }
    },
  })
);

// Main webhook endpoint
app.post('/github-webhook', async (req, res) => {
  // Check event type
  const ghEvent = req.headers['x-github-event'];
  const payload = req.body;

  // We only care about pull_request events with action "opened"
  if (ghEvent === 'pull_request' && payload.action === 'opened') {
    const pr = payload.pull_request;
    const repo = payload.repository;
    const owner = repo.owner.login;
    const repoName = repo.name;
    const pullNumber = pr.number;
    const prUserLogin = pr.user.login;

    console.log(`PR #${pullNumber} opened in ${owner}/${repoName} by ${prUserLogin}`);

    try {
      // 1) Retrieve the user from DB, so we can get their token
      //    This token might be the user's personal token, or you might use an app token from .env
      let userToken;
      const dbUser = await User.findOne({ githubUsername: prUserLogin });
      if (dbUser) {
        userToken = dbUser.githubToken;
      } else {
        // fallback if user not found, maybe use the app token
        userToken = process.env.OAUTH_APP_TOKEN;
      }

      if (!userToken) {
        console.log('No token found for PR user or in env. Exiting.');
        return res.status(200).send('No token found, cannot comment.');
      }

      // 2) Gather changed files in this PR
      const filesUrl = pr._links.self.href.replace('{/number}', '') + '/files';
      // or equivalently: `https://api.github.com/repos/${owner}/${repoName}/pulls/${pullNumber}/files`
      const fileRes = await axios.get(filesUrl, {
        headers: { Authorization: `token ${userToken}` },
      });
      const changedFiles = fileRes.data; // array of files

      // Build a snippet of changes to feed to Gemini
      let changesSummary = '';
      changedFiles.forEach((file) => {
        changesSummary += `\nFile: ${file.filename}\n`;
        changesSummary += `Status: ${file.status}\n`;
        if (file.patch) {
          changesSummary += `Diff:\n${file.patch}\n`;
        }
        changesSummary += '-----------------\n';
      });

      // 3) Create a well-written prompt for Gemini
      const geminiPrompt = `
You are a code-review assistant. A pull request was just created. Below are the changes in diff format:

${changesSummary}

Please analyze these changes and prepare a concise but thorough code review comment (in Markdown) highlighting:

- Potential improvements,
- Questions or clarifications for the author,
- Overall assessment of the changes.

Return only the code review comment in valid Markdown.
      `;

      // 4) Ask Gemini for a code review comment
      const geminiResponse = await generateGeminiPRComment(geminiPrompt);

      // 5) Post the comment to the PR
      const commentUrl = `https://api.github.com/repos/${owner}/${repoName}/issues/${pullNumber}/comments`;
      await axios.post(
        commentUrl,
        { body: geminiResponse },
        {
          headers: { Authorization: `token ${userToken}` },
        }
      );

      console.log('Posted Gemini code review comment successfully.');
      return res.status(200).send('Success');
    } catch (err) {
      console.error('Error handling PR creation:', err);
      return res.status(500).send('Error processing webhook');
    }
  } else {
    // We ignore other events
    return res.status(200).send('Event ignored');
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});
