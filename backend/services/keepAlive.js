const https = require('https');

// Keep Render backend awake by pinging itself every 10 minutes
const BACKEND_URL = 'https://deepfocus-backend.onrender.com';

function keepAlive() {
    https.get(BACKEND_URL, (res) => {
        console.log(`Keep-alive ping: ${res.statusCode}`);
    }).on('error', (err) => {
        console.error('Keep-alive ping failed:', err.message);
    });
}

// Ping every 10 minutes (600000 ms) to prevent cold starts
if (process.env.NODE_ENV === 'production') {
    setInterval(keepAlive, 10 * 60 * 1000);
    console.log('Keep-alive service started - pinging every 10 minutes');
}

module.exports = { keepAlive };
