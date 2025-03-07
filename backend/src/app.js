const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const verificationRequestRoutes = require('./routes/verificationRequest.routes');
const marketRoutes = require('./routes/market.routes');
const eventRoutes = require('./routes/event.routes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/verification-requests', verificationRequestRoutes);
app.use('/api/markets', marketRoutes);
app.use('/api/events', eventRoutes); 