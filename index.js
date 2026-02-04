require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const stalkRoutes = require('./routes/stalk');
const downloadRoutes = require('./routes/download');
const searchRoutes = require('./routes/search');
const convertRoutes = require('./routes/convert');
const tiktokRoutes = require('./routes/tiktok');

app.use('/api/stalk', stalkRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/convert', convertRoutes);
app.use('/api/tiktok', tiktokRoutes);

// Request Counter
global.requestCount = 0;

// Request Counting Middleware
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
        global.requestCount++;
    }
    next();
});

// Landing Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health Check & Stats (For Heroku/Uptime Monitors)
app.get('/health', (req, res) => {
    res.json({
        status: true,
        message: "WASI-DEV-APIS is healthy!",
        uptime: process.uptime(),
        requests: global.requestCount
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        status: false,
        message: "Endpoint not found. Check the documentation on the home page."
    });
});

// Bind to 0.0.0.0 for Heroku
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 WASI-DEV-APIS is running on port ${PORT}`);
});
