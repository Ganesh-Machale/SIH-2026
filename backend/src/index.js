const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { getDB } = require('./db');

const authRoutes = require('./routes/auth');
const produceRoutes = require('./routes/produce');
const marketsRoutes = require('./routes/markets');
const recommendationsRoutes = require('./routes/recommendations');
const buyersRoutes = require('./routes/buyers');
const simulatorRoutes = require('./routes/simulator');
const fpoRoutes = require('./routes/fpo');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Route mounts
app.use('/api/auth', authRoutes);
app.use('/api/produce', produceRoutes);
app.use('/api/markets', marketsRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/buyers', buyersRoutes);
app.use('/api/simulator', simulatorRoutes);
app.use('/api/fpo', fpoRoutes);
app.use('/api/admin', adminRoutes);

// General health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ONLINE',
        app: 'KisanNiti AI Backend',
        sih_problem_id: 'SIH26132',
        timestamp: new Date().toISOString()
    });
});

// Initialize DB and launch server
getDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 KisanNiti AI Backend API running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to start server:', err);
});
