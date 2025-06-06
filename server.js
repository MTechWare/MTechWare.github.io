// server.js - Node.js Express backend with secure forgot password rate limiting
const express = require('express');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// In-memory user store (replace with DB in production)
const users = {};

// Password reset cooldown per user (ms)
const PASSWORD_RESET_COOLDOWN = 15 * 60 * 1000; // 15 minutes

// Rate limiter for forgot password endpoint (per IP)
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs
  message: 'Too many password reset requests. Please try again later.'
});

// Rate limiter for login and signup endpoints (per IP)
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many attempts, please try again later.'
});

// --- SESSION SETUP (EXAMPLE) ---
const session = require('express-session');
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// --- Signup endpoint ---
app.post('/signup', authLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
    return res.status(400).send('Invalid input');
  }
  if (users[email]) {
    return res.status(409).send('User already exists');
  }
  // Hash the password securely
  const hash = await bcrypt.hash(password, 12);
  users[email] = { password: hash, lastReset: 0 };
  res.send('Signup successful');
});

// --- Login endpoint ---
app.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;
  const user = users[email];
  if (!user) {
    return res.status(401).send('Invalid credentials');
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).send('Invalid credentials');
  }
  res.send('Login successful');
});

// --- Forgot Password endpoint ---
app.post('/forgot-password', forgotPasswordLimiter, (req, res) => {
  const { email } = req.body;
  const now = Date.now();
  const user = users[email];

  // Always respond generically to prevent user enumeration
  if (!user) {
    return res.send('If that email is registered, you will receive a reset link.');
  }

  // Check per-user cooldown
  if (user.lastReset && (now - user.lastReset < PASSWORD_RESET_COOLDOWN)) {
    return res.status(429).send('A reset link was recently sent. Please wait before requesting another.');
  }

  // Simulate sending email
  user.lastReset = now;
  console.log(`Sending password reset email to ${email}`);
  res.send('If that email is registered, you will receive a reset link.');
});

// Example: Add a test user (replace with DB logic)
(async () => {
  users['test@example.com'] = { password: await bcrypt.hash('TestPassword123!', 12), lastReset: 0 };
})();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// --- SECURITY NOTES ---
// - Move secrets (like session secrets, API keys) to environment variables
// - Use HTTPS in production and set cookie.secure: true if using sessions
// - Replace in-memory users with a secure database
// - Never expose stack traces or sensitive errors to the client
// - Always validate and sanitize all user input
