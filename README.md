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

1. Navigate to the 

backend

 directory:

    ```bash
    cd backend
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Create a 

.env

 file in the 

backend

 directory and add the following environment variables:

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

1. Navigate to the 

frontend

 directory:

    ```bash
    cd ../frontend
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Create a 

.env

 file in the 

frontend

 directory and add the following environment variables:

    ```env
    # FRONT END
    PORT=3000
    REACT_APP_BACKEND_API_URL=http://localhost:4000
    REACT_APP_GITHUB_LOGIN_URL=http://localhost:4000/auth/github
    REACT_APP_GITHUB_LOGOUT_URL=http://localhost:4000/auth/logout
    REACT_APP_GITHUB_USER_URL=http://localhost:4000/auth/user
    ```

4. Start the frontend development server:

    ```bash
    npm start
    ```

### Running the Application

1. Open your browser and navigate to `http://localhost:3000`.
2. Click the "Login with GitHub" button to authenticate with GitHub.
3. After successful authentication, you will be redirected to the profile page where you can see your GitHub repositories.

### Project Structure

```
my-github-oauth-app/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── auth.js
│   ├── .env
│   ├── package.json
│   ├── passport.js
│   └── server.js
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── FileTree.js
│   │   ├── Profile.js
│   │   ├── RepoDetail.js
│   │   ├── UserContext.js
│   │   ├── index.css
│   │   ├── index.js
│   ├── .env
│   ├── package.json
│   └── README.md
├── .gitignore
└── README.md
```

### Troubleshooting

- **MongoDB Connection Error**: Ensure that your MongoDB URI is correct and that your MongoDB server is running.
- **GitHub OAuth Error**: Ensure that your GitHub OAuth app is correctly configured with the correct client ID, client secret, and callback URL.
- **CORS Issues**: Ensure that the backend CORS configuration allows requests from the frontend URL.

### License

This project is licensed under the MIT License.