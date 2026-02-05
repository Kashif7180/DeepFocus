if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: './backend/.env' });
}
const express = require('express');
const cors = require('cors');
const { connectDB } = require('../backend/config/db');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route to check if server is running
app.get('/', (req, res) => {
    res.send('Personal Productivity & Focus Tracker API is running...');
});

// Auth Routes
app.use('/api/auth', require('../backend/routes/authRoutes'));

// Activity Routes
app.use('/api/activities', require('../backend/routes/activityRoutes'));

// Init Report Scheduler (only in non-serverless environments)
if (process.env.NODE_ENV !== 'production') {
    const { initReportScheduler, generateWeeklyReport } = require('../backend/services/reportService');
    initReportScheduler();

    // Manual Trigger for testing (Admin or local only ideally)
    app.post('/api/admin/trigger-reports', async (req, res) => {
        try {
            await generateWeeklyReport();
            res.json({ message: 'Reports generation triggered' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}

// Define the port from environment variables or use 5000 as default
const PORT = process.env.PORT || 5000;

// Start server only if not in production (Vercel handles this)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
