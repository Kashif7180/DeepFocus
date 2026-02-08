// Quick test script to check email sending
require('dotenv').config({ path: './backend/.env' });
const nodemailer = require('nodemailer');

const testEmail = async () => {
    console.log('Testing email with credentials:');
    console.log('HOST:', process.env.EMAIL_HOST);
    console.log('PORT:', process.env.EMAIL_PORT);
    console.log('USER:', process.env.EMAIL_USER);
    console.log('PASS:', process.env.EMAIL_PASS ? '***set***' : 'NOT SET');

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
            from: '"DeepFocus Test" <onboarding@resend.dev>',
            to: 'kashif.cricfan@gmail.com',
            subject: 'Test Email from DeepFocus',
            html: '<h1>Email Working!</h1><p>If you see this, email configuration is correct.</p>'
        });
        console.log('✅ Email sent successfully!');
    } catch (error) {
        console.error('❌ Email failed:', error);
    }
};

testEmail();
