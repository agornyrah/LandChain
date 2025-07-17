const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const propertiesRoutes = require('./routes/properties');
const transactionsRoutes = require('./routes/transactions');
const blockchainRoutes = require('./routes/blockchain');
const usersRoutes = require('./routes/users');
const cors = require('cors');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

const app = express();

// Enable CORS with credentials
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Support both Vite ports
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Session middleware
app.use(session({
  store: new SQLiteStore({ db: 'sessions.sqlite' }),
  secret: process.env.SESSION_SECRET || 'your-secret-key-here',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/users', usersRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
