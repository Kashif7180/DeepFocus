const axios = require('axios');

const testAuth = async () => {
    try {
        console.log('Testing Signup...');
        const signupRes = await axios.post('http://localhost:5000/api/auth/signup', {
            name: 'Test User',
            email: 'test' + Date.now() + '@example.com',
            password: 'password123'
        });
        console.log('Signup Success:', signupRes.data.name);

        console.log('Testing Login...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: signupRes.data.email,
            password: 'password123'
        });
        console.log('Login Success! Token received.');
    } catch (error) {
        console.error('Test Failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
};

testAuth();
