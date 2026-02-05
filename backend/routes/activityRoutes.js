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

module.exports = router;
