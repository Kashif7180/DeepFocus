const cron = require('node-cron');
const { getDB } = require('../config/db');
const sendEmail = async (email, subject, html) => {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        await transporter.sendMail({
            from: '"DeepFocus Weekly" <noreply@deepfocus.com>',
            to: email,
            subject: subject,
            html: html
        });
        console.log(`Report sent to ${email}`);
    } catch (err) {
        console.error(`Email failed for ${email}:`, err.message);
    }
};

const generateWeeklyReport = async () => {
    console.log('Running Weekly Report Generation...');
    const db = getDB();
    const users = await db.collection('users').find().toArray();

    for (const user of users) {
        try {
            const last7Days = new Date();
            last7Days.setDate(last7Days.getDate() - 7);

            // Fetch activities for last 7 days
            const activities = await db.collection('activities').find({
                userId: user._id,
                date: { $gte: last7Days.toISOString().split('T')[0] }
            }).toArray();

            if (activities.length === 0) continue;

            const totalActual = activities.reduce((sum, a) => sum + parseFloat(a.actualTime), 0);
            const totalPlanned = activities.reduce((sum, a) => sum + parseFloat(a.expectedTime), 0);
            const efficiency = ((totalActual / totalPlanned) * 100).toFixed(1);

            const categoryStats = activities.reduce((acc, a) => {
                acc[a.category] = (acc[a.category] || 0) + parseFloat(a.actualTime);
                return acc;
            }, {});

            const statsHtml = Object.entries(categoryStats)
                .map(([cat, hours]) => `<li><strong>${cat}:</strong> ${hours}h</li>`)
                .join('');

            const emailHtml = `
                <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #6366f1;">DeepFocus Weekly Summary</h2>
                    <p>Hi ${user.name},</p>
                    <p>Here is your productivity breakdown for the last 7 days:</p>
                    
                    <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Overall Stats</h3>
                        <p>Total Time Focused: <strong>${totalActual} hours</strong></p>
                        <p>Planning Efficiency: <strong>${efficiency}%</strong></p>
                    </div>

                    <h3>Focus Distribution</h3>
                    <ul>${statsHtml}</ul>

                    <p>Keep up the great work! Measuring your time is the first step toward mastering it.</p>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <small style="color: #999;">Sent automatically by your DeepFocus Dashboard.</small>
                </div>
            `;

            await sendEmail(user.email, 'Your Weekly Productivity Report 🚀', emailHtml);
        } catch (error) {
            console.error(`Error generating report for user ${user.email}:`, error);
        }
    }
};

// Schedule: Every Sunday at 9:00 PM
// '0 21 * * 0' -> Minutes Hours Day Month DayOfWeek
const initReportScheduler = () => {
    cron.schedule('0 21 * * 0', generateWeeklyReport);

    // For testing/demo: runs every minute if enabled (NOT recommended for production)
    // cron.schedule('* * * * *', () => {
    //    console.log("Minute check for report service...");
    // });

    console.log('Report Scheduler Initialized (Active - Runs Every Sunday 9PM)');
};

module.exports = { initReportScheduler, generateWeeklyReport };
