const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const propertiesRoutes = require('./routes/properties');
const transactionsRoutes = require('./routes/transactions');
const blockchainRoutes = require('./routes/blockchain');
const usersRoutes = require('./routes/users');

const app = express();

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
