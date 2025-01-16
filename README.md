# Developer Performance Tracker

## Overview

Developer Performance Tracker is a full-stack tool designed to analyze and enhance developer productivity using Large Language Model (LLM) reasoning. Our system identifies high-performing ("10x") developers and automates pull request (PR) reviews. Future updates will incorporate machine learning-based predictions to further optimize developer workflows.

## Features

- **LLM-Powered Developer Analysis**: Identifies high-performing developers based on coding patterns and contributions.
- **Automated PR Reviews**: Uses AI to review pull requests, providing insightful feedback and recommendations.
- **Performance Metrics Dashboard**: Visualizes key productivity indicators for teams and individuals.
- **ML-Based Predictions (Upcoming)**: Predicts developer efficiency and potential bottlenecks in projects.

## Tech Stack

- **Backend**: Node.js, Express, MongoDB
- **Frontend**: React.js
- **Authentication**: GitHub OAuth
- **AI Processing**: OpenAI GPT / LLM models
- **Infrastructure**: Docker, Kubernetes (Planned), GitHub Actions

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB (local or Atlas)

### Installation

#### Clone the Repository
```bash
git clone https://github.com/your-username/dev-performance-tracker.git
cd dev-performance-tracker
```

#### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```
   PORT=4000
   MONGO_URI=your_mongodb_connection_string
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   GITHUB_CALLBACK_URL=http://localhost:4000/auth/github/callback
   SESSION_SECRET=someRandomSecret
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

#### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```
   PORT=3000
   REACT_APP_BACKEND_API_URL=http://localhost:4000
   REACT_APP_GITHUB_LOGIN_URL=http://localhost:4000/auth/github
   REACT_APP_GITHUB_USER_URL=http://localhost:4000/auth/user
   ```
4. Start the frontend server:
   ```bash
   npm start
   ```

## Usage

### Running Locally
1. Ensure MongoDB is running locally or configure MongoDB Atlas.
2. Start the backend server (`npm run dev` in `backend/`).
3. Start the frontend (`npm start` in `frontend/`).

### Automated PR Reviews
1. Configure your GitHub repository webhook to point to:
   ```
   http://your-server-url/github-webhook
   ```
2. The system will analyze and provide AI-generated feedback for new PRs.

## Troubleshooting

- **MongoDB Connection Error**: Verify your MongoDB URI and ensure the database is running.
- **GitHub OAuth Issues**: Check your GitHub client credentials and callback URL settings.
- **CORS Issues**: Ensure backend CORS settings allow requests from the frontend URL.

## Roadmap
- ✅ LLM-Powered PR Reviews
- ✅ Developer Performance Insights
- 🔄 ML-Based Developer Efficiency Predictions
- 🔄 Team Productivity Heatmaps
- 🔄 Kubernetes Deployment Support

## Contributing
We welcome contributions from the community! If you'd like to contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.