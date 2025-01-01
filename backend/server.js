// server.js
require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');

require('./passport'); // Your passport config
const authRoutes = require('./routes/auth');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(
  cors({
    origin: 'http://localhost:3000', // IMPORTANT: match your React port
    credentials: true,
  })
);

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'someRandomSecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,   // false in development over HTTP
      sameSite: 'lax', // 'lax' is usually simpler for local dev
      maxAge: 24 * 60 * 60 * 1000
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

// Use auth routes
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
