const express = require('express');
const router = express.Router();
const {
    createActivity,
    getActivities,
    getInsights,
    getAnalytics,
    getGoals,
    setGoal,
    updateActivity,
    deleteActivity
} = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');

// Route for adding a new activity
router.post('/', protect, createActivity);

// Route for getting all activities
router.get('/', protect, getActivities);

// Route for getting productivity insights
router.get('/insights', protect, getInsights);

// Route for advanced analytics
router.get('/analytics', protect, getAnalytics);

// Route for goals
router.get('/goals', protect, getGoals);
router.post('/goals', protect, setGoal);

// Route for updating an activity
router.put('/:id', protect, updateActivity);

// Route for deleting an activity
router.delete('/:id', protect, deleteActivity);

// TEST EMAIL ENDPOINT - Remove after testing
router.post('/test-email', async (req, res) => {
    try {
        const { Resend } = require('resend');
        const resend = new Resend(process.env.EMAIL_PASS);

        console.log('API Key exists:', !!process.env.EMAIL_PASS);

        const { data, error } = await resend.emails.send({
            from: 'DeepFocus Test <onboarding@resend.dev>',
            to: ['kashif.cricfan@gmail.com'],
            subject: 'Direct Test from Render',
            html: '<h1>If you see this, Resend API is working!</h1>'
        });

        if (error) {
            console.error('Resend Error:', error);
            return res.status(400).json({ error: error });
        }

        console.log('Email sent successfully:', data);
        res.json({ success: true, data: data });
    } catch (err) {
        console.error('Test email error:', err.message);
        res.status(500).json({ error: err.message, stack: err.stack });
    }
});

module.exports = router;
