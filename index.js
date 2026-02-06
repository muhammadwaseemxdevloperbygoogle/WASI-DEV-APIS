require('dotenv').config();
const express = require('express');
const next = require('next');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const PORT = process.env.PORT || 3000;

nextApp.prepare().then(() => {
    const app = express();

    // Middleware
    app.use(cors());
    app.use(express.json());
    app.use(morgan('dev'));

    // Serve static files from public (legacy support if needed, but Next.js has its own public)
    // We keep this for API-specific assets if strictly necessary, but Next usually handles public folder in root
    // app.use(express.static(path.join(__dirname, 'public'))); 

    // API Routes (Keep your existing API logic)
    app.use('/api/stalk', require('./routes/stalk'));
    app.use('/api/download', require('./routes/download'));
    app.use('/api/search', require('./routes/search'));
    app.use('/api/convert', require('./routes/convert'));
    app.use('/api/tiktok', require('./routes/tiktok'));
    app.use('/api/cricket', require('./routes/cricket'));

    // Global Request Counter
    global.requestCount = 0;
    app.use((req, res, next) => {
        if (req.path.startsWith('/api')) {
            global.requestCount++;
        }
        next();
    });

    // API Health Check
    app.get('/health', (req, res) => {
        res.json({
            status: true,
            message: "WASI-DEV-APIS is healthy!",
            uptime: process.uptime(),
            requests: global.requestCount
        });
    });

    // Let Next.js handle everything else
    app.all(/.*/, (req, res) => {
        return handle(req, res);
    });

    app.listen(PORT, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${PORT}`);
    });
});
