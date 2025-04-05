
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

connectDB();

// Import Routes
const authRoutes = require('./routes/auth');
const bloodRequestRoutes = require('./routes/bloodRequests');
const bloodBankRoutes = require('./routes/bloodBanks');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blood-requests', bloodRequestRoutes);
app.use('/api/blood-banks', bloodBankRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Blood Donation API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
