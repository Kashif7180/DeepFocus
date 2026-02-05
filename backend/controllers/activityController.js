const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

// @desc    Create a new activity
// @route   POST /api/activities
const createActivity = async (req, res) => {
    try {
        const db = getDB();
        const { title, category, expectedTime, actualTime, date } = req.body;

        if (!title || !category || !expectedTime || !actualTime || !date) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const newActivity = {
            userId: req.user._id,
            title,
            category,
            expectedTime: parseFloat(expectedTime),
            actualTime: parseFloat(actualTime),
            date, // Format: YYYY-MM-DD
            createdAt: new Date()
        };

        const result = await db.collection('activities').insertOne(newActivity);

        res.status(201).json({
            message: 'Activity created successfully',
            activityId: result.insertedId,
            activity: newActivity
        });
    } catch (error) {
        console.error('Error creating activity:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all activities (with optional date filtering)
// @route   GET /api/activities?date=YYYY-MM-DD
const getActivities = async (req, res) => {
    try {
        const db = getDB();
        const { date } = req.query;
        const query = { userId: req.user._id };
        if (date) query.date = date;

        const activities = await db.collection('activities').find(query).toArray();
        res.status(200).json(activities);
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get productivity insights (using MongoDB Aggregation)
// @route   GET /api/activities/insights?date=YYYY-MM-DD
const getInsights = async (req, res) => {
    try {
        const db = getDB();
        const { date } = req.query;

        // Build the pipeline
        const pipeline = [
            // Stage 1: Filter by userId AND date if provided
            {
                $match: {
                    userId: req.user._id,
                    ...(date ? { date } : {})
                }
            },

            // Stage 2: Run multiple calculations at once!
            {
                $facet: {
                    // Part A: Group by category
                    categoryStats: [
                        {
                            $group: {
                                _id: "$category",
                                expected: { $sum: "$expectedTime" },
                                actual: { $sum: "$actualTime" }
                            }
                        }
                    ],
                    // Part B: Calculate grand totals
                    overallStats: [
                        {
                            $group: {
                                _id: null,
                                totalExpected: { $sum: "$expectedTime" },
                                totalActual: { $sum: "$actualTime" }
                            }
                        }
                    ]
                }
            }
        ];

        const result = await db.collection('activities').aggregate(pipeline).toArray();
        const data = result[0]; // aggregate returns an array, but facet always gives 1 result object

        if (!data.overallStats.length) {
            return res.status(200).json({ message: 'No activities found', totals: null });
        }

        const totals = data.overallStats[0];
        const efficiency = (totals.totalExpected > 0) ? (totals.totalActual / totals.totalExpected) * 100 : 0;

        let status = "";
        if (efficiency > 110) status = "Over-extended";
        else if (efficiency < 90) status = "Under-productive";
        else status = "On-target";

        res.status(200).json({
            totals: {
                totalExpected: totals.totalExpected,
                totalActual: totals.totalActual,
                efficiency: efficiency.toFixed(2) + "%"
            },
            status,
            categoryStats: data.categoryStats
        });
    } catch (error) {
        console.error('Aggregation Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update an activity
// @route   PUT /api/activities/:id
const updateActivity = async (req, res) => {
    try {
        const db = getDB();
        const { id } = req.params;
        const { title, category, expectedTime, actualTime, date } = req.body;

        const updatedData = {
            title,
            category,
            expectedTime: parseFloat(expectedTime),
            actualTime: parseFloat(actualTime),
            date
        };

        const result = await db.collection('activities').updateOne(
            { _id: new ObjectId(id), userId: req.user._id },
            { $set: updatedData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Activity not found or not authorized' });
        }

        res.status(200).json({ message: 'Activity updated successfully' });
    } catch (error) {
        console.error('Error updating activity:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete an activity
// @route   DELETE /api/activities/:id
const deleteActivity = async (req, res) => {
    try {
        const db = getDB();
        const { id } = req.params;

        const result = await db.collection('activities').deleteOne({
            _id: new ObjectId(id),
            userId: req.user._id
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Activity not found or not authorized' });
        }

        res.status(200).json({ message: 'Activity deleted successfully' });
    } catch (error) {
        console.error('Error deleting activity:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get advanced analytics (Heatmap, Trends, Distribution)
// @route   GET /api/activities/analytics
const getAnalytics = async (req, res) => {
    try {
        const db = getDB();
        const userId = req.user._id;

        // 1. Get current date info
        const now = new Date();
        const last7Days = new Date(new Date().setDate(now.getDate() - 7)).toISOString().split('T')[0];
        const prev7Days = new Date(new Date().setDate(now.getDate() - 14)).toISOString().split('T')[0];

        const pipeline = [
            { $match: { userId } },
            {
                $facet: {
                    // Part 1: Heatmap (Last 90 days)
                    heatmap: [
                        {
                            $group: {
                                _id: "$date",
                                count: { $sum: "$actualTime" }
                            }
                        },
                        { $sort: { _id: 1 } }
                    ],
                    // Part 2: Weekly Trend
                    weeklyTrend: [
                        {
                            $group: {
                                _id: {
                                    $cond: [
                                        { $gte: ["$date", last7Days] },
                                        "current",
                                        { $cond: [{ $gte: ["$date", prev7Days] }, "previous", "older"] }
                                    ]
                                },
                                total: { $sum: "$actualTime" }
                            }
                        }
                    ],
                    // Part 3: Category Distribution
                    distribution: [
                        {
                            $group: {
                                _id: "$category",
                                value: { $sum: "$actualTime" }
                            }
                        }
                    ]
                }
            }
        ];

        const result = await db.collection('activities').aggregate(pipeline).toArray();
        const data = result[0];

        // Process Trends
        const currentWeek = data.weeklyTrend.find(t => t._id === 'current')?.total || 0;
        const previousWeek = data.weeklyTrend.find(t => t._id === 'previous')?.total || 0;
        let trendPercent = 0;
        if (previousWeek > 0) {
            trendPercent = ((currentWeek - previousWeek) / previousWeek) * 100;
        }

        res.status(200).json({
            heatmap: data.heatmap,
            distribution: data.distribution,
            trends: {
                currentWeek,
                previousWeek,
                trendPercent: trendPercent.toFixed(1)
            }
        });
    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Set or Update a weekly goal
// @route   POST /api/activities/goals
const setGoal = async (req, res) => {
    try {
        const db = getDB();
        const { category, targetHours } = req.body;

        if (!category || !targetHours) {
            return res.status(400).json({ message: 'Category and target hours required' });
        }

        const goal = {
            userId: req.user._id,
            category,
            targetHours: parseFloat(targetHours),
            updatedAt: new Date()
        };

        await db.collection('goals').updateOne(
            { userId: req.user._id, category },
            { $set: goal },
            { upsert: true }
        );

        res.status(200).json({ message: 'Goal updated successfully', goal });
    } catch (error) {
        console.error('Set Goal Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all goals for user
// @route   GET /api/activities/goals
const getGoals = async (req, res) => {
    try {
        const db = getDB();
        const goals = await db.collection('goals').find({ userId: req.user._id }).toArray();
        res.status(200).json(goals);
    } catch (error) {
        console.error('Get Goals Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createActivity,
    getActivities,
    getInsights,
    getAnalytics,
    setGoal,
    getGoals,
    updateActivity,
    deleteActivity
};
