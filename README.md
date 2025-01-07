# GitHub OAuth App

This is a full-stack application that uses GitHub OAuth for authentication. The backend is built with Node.js, Express, and MongoDB, while the frontend is built with React.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local or Atlas)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/your-username/my-github-oauth-app.git
cd my-github-oauth-app
```

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install the dependencies:

```bash
npm install
```

3. Create a .env file in the backend directory and add the following environment variables:

```env
# BACKEND
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

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd ../frontend
```

2. Install the dependencies:

```bash
npm install
```

3. Create a .env

```env
# FRONT END
PORT=3000
REACT_APP_BACKEND_API_URL=http://localhost:4000
REACT_APP_GITHUB_LOGIN_URL=http://localhost:4000/auth/github
REACT_APP_GITHUB_LOGOUT_URL=http://localhost:4000/auth/logout
REACT_APP_GITHUB_USER_URL=http://localhost:4000/auth/user
```

### Project Structure

```
my-github-oauth-app/
├── README.md
├── backend
│   ├── config
│   │   └── db.js
│   ├── models
│   │   └── User.js
│   ├── package-lock.json
│   ├── package.json
│   ├── passport.js
│   ├── routes
│   │   └── auth.js
│   └── server.js
├── frontend
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   └── src
│       ├── App.css
│       ├── App.js
│       ├── Assets
│       │   └── github-logo.png
│       ├── Components
│       │   ├── ChatHistory
│       │   │   └── ChatHistory.js
│       │   ├── ChatInput
│       │   │   └── ChatInput.js
│       │   ├── Dashboard
│       │   │   ├── DashBoard.css
│       │   │   └── Dashboard.js
│       │   ├── FileTree
│       │   │   └── FileTree.js
│       │   └── Navbar
│       │       ├── Navbar.css
│       │       └── Navbar.js
│       ├── Pages
│       │   ├── AI
│       │   │   ├── AI.css
│       │   │   ├── AI.js
│       │   │   └── GeminiChat.js
│       │   ├── CodeViewer
│       │   │   └── CodeViewer.js
│       │   ├── Login
│       │   │   ├── Login.js
│       │   │   └── Login.module.css
│       │   ├── Profile
│       │   │   ├── Profile.js
│       │   │   └── profile.css
│       │   └── Repositories
│       │       ├── RepoDetail.css
│       │       ├── RepoDetail.js
│       │       ├── Repositories.css
│       │       └── Repositories.js
│       ├── UserContext.js
│       ├── Utils
│       │   └── aiUtils.js
│       ├── index.css
│       ├── index.js
│       └── logo.svg
└── webhook
    ├── db.js
    ├── models
    │   └── User.js
    ├── package-lock.json
    ├── package.json
    └── server.js
```

### Troubleshooting

- **MongoDB Connection Error**: Ensure that your MongoDB URI is correct and that your MongoDB server is running.
- **GitHub OAuth Error**: Ensure that your GitHub OAuth app is correctly configured with the correct client ID, client secret, and callback URL.
- **CORS Issues**: Ensure that the backend CORS configuration allows requests from the frontend URL.

### License

This project is licensed under the MIT License.